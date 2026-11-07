import json
import os
import sys
import time
import shutil
import zipfile
import tkinter as tk
from tkinter import filedialog, simpledialog, messagebox
from datetime import datetime
import webview
import requests
import base64
import urllib.request
import tempfile
import serial
import serial.tools.list_ports

_photo_data = None

def normalize_path(path):
    return path.replace('/', '\\')

def detect_drive():
    for d in 'CDEFGHIJKLMNOPQRSTUVWXYZ':
        if os.path.exists(f'{d}:\\quickapp'):
            return f'{d}:'
    return None

def format_time(timestamp):
    try:
        if timestamp > 10000000000:
            timestamp = timestamp / 1000
        return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')
    except:
        return str(timestamp)

def format_size(path):
    total = 0
    try:
        if os.path.exists(path):
            for dirpath, dirnames, filenames in os.walk(path):
                for f in filenames:
                    fp = os.path.join(dirpath, f)
                    if os.path.exists(fp):
                        total = os.path.getsize(fp)
    except:
        pass
    if total < 1024:
        return f"{total} B"
    elif total < 1024 * 1024:
        return f"{total / 1024:.1f} KB"
    elif total < 1024 * 1024 * 1024:
        return f"{total / 1024 / 1024:.1f} MB"
    else:
        return f"{total / 1024 / 1024 / 1024:.2f} GB"

def get_app_list(drive):
    json_path = os.path.join(drive, 'quickapp', 'system', 'package.json')
    if not os.path.exists(json_path):
        return []
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data.get('packageList', [])

def save_app_list(drive, app_list):
    json_path = os.path.join(drive, 'quickapp', 'system', 'package.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({'packageList': app_list}, f, ensure_ascii=False, indent=4)

def cmd_usb(args=None):
    if not args or len(args) < 1:
        print("用法: rtos.py usb <com_port>")
        return 1
    com_port = args[0]
    try:
        ser = serial.Serial(com_port, 115200, timeout=5)
        time.sleep(0.5)
        ser.write(b'AT+LEAFAC=0\r\n')
        time.sleep(0.5)
        response = ser.read(ser.in_waiting or 1024).decode('utf-8', errors='ignore')
        ser.close()
        if 'OK' in response:
            print("AT指令发送成功")
            print("请在手表上打开拨号，输入 *#0769789#*")
        else:
            print(f"响应: {response}")
        return 0
    except Exception as e:
        print(f"错误: {e}")
        return 1

def cmd_install(args):
    if len(args) < 2:
        print("用法: rtos.py install <rpk_path> <drive>")
        return 1
    rpk_path = normalize_path(args[0])
    drive = args[1]
    if not os.path.exists(rpk_path):
        print(f"文件不存在: {rpk_path}")
        return 1
    print(f"正在解压: {os.path.basename(rpk_path)}...")
    temp_dir = os.path.join(os.path.dirname(rpk_path), '_temp_extract')
    os.makedirs(temp_dir, exist_ok=True)
    try:
        with zipfile.ZipFile(rpk_path, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
    except Exception as e:
        print(f"解压失败: {e}")
        shutil.rmtree(temp_dir, ignore_errors=True)
        return 1
    print("正在读取快应用信息...")
    items = os.listdir(temp_dir)
    if len(items) == 1:
        sub_dir = os.path.join(temp_dir, items[0])
        if os.path.isdir(sub_dir):
            for item in os.listdir(sub_dir):
                src = os.path.join(sub_dir, item)
                dst = os.path.join(temp_dir, item)
                shutil.move(src, dst)
            os.rmdir(sub_dir)
    manifest_file = os.path.join(temp_dir, 'manifest.json')
    if not os.path.exists(manifest_file):
        print("未找到manifest.json")
        shutil.rmtree(temp_dir, ignore_errors=True)
        return 1
    with open(manifest_file, 'r', encoding='utf-8') as f:
        manifest = json.load(f)
    package_name = manifest.get('package', '')
    app_name = manifest.get('name', '')
    version = manifest.get('versionName', '1.0.0')
    version_code = manifest.get('versionCode', 1)
    icon_rel = manifest.get('icon', '').lstrip('/')
    if not package_name:
        print("快应用信息缺少 package 字段")
        shutil.rmtree(temp_dir, ignore_errors=True)
        return 1
    app_list = get_app_list(drive)
    existing = None
    for app in app_list:
        if app.get('packagename') == package_name:
            existing = app
            break
    if existing:
        print(f"应用已存在: {app_name} ({package_name})")
        choice = input("是否覆盖安装？(y/n): ")
        if choice.lower() != 'y':
            print("已取消安装")
            shutil.rmtree(temp_dir, ignore_errors=True)
            return 0
    install_path = os.path.join(drive, 'quickapp', 'install', package_name)
    data_path = os.path.join(drive, 'quickapp', 'data', package_name)
    rpk_dest = os.path.join(drive, 'quickapp', 'system', 'rpks', f'{package_name}.rpk')
    if existing:
        if os.path.exists(existing.get('installPath', '')):
            shutil.rmtree(existing.get('installPath', ''), ignore_errors=True)
        if os.path.exists(existing.get('dataPath', '')):
            shutil.rmtree(existing.get('dataPath', ''), ignore_errors=True)
        if os.path.exists(existing.get('rpkPath', '')):
            os.remove(existing.get('rpkPath', ''))
        app_list.remove(existing)
    print(f"正在复制文件到: {install_path}...")
    os.makedirs(install_path, exist_ok=True)
    for item in os.listdir(temp_dir):
        src = os.path.join(temp_dir, item)
        dst = os.path.join(install_path, item)
        if os.path.isdir(src):
            shutil.copytree(src, dst)
        else:
            shutil.copy2(src, dst)
    shutil.rmtree(temp_dir, ignore_errors=True)
    os.makedirs(os.path.dirname(rpk_dest), exist_ok=True)
    shutil.copy2(rpk_path, rpk_dest)
    # 不删除用户原文件
    icon_path = ''
    if icon_rel:
        test_path = os.path.join(install_path, icon_rel)
        if os.path.exists(test_path):
            icon_path = test_path
    if not icon_path:
        common_icons = ['common/img/icon/icon.png', 'common/logo.png', 'icon.png', 'assets/icon.png']
        for rel in common_icons:
            test_path = os.path.join(install_path, rel)
            if os.path.exists(test_path):
                icon_path = test_path
                break
    print("正在更新 package.json...")
    new_app = {
        "packageName": package_name,
        "rpkPath": rpk_dest,
        "installPath": install_path,
        "dataPath": data_path,
        "iconPath": icon_path,
        "forbidIconPath": icon_path,
        "smallIconPath": "NULL",
        "version": version,
        "appName": app_name,
        "nameLength": len(app_name),
        "packageType": 1,
        "installTime": int(time.time()),
        "installCurTimestamp": int(time.time() * 1000),
        "isForbid": 0,
        "versionCode": version_code,
        "isHide": 0,
        "installType": 1,
        "permissions": 1
    }
    app_list.append(new_app)
    save_app_list(drive, app_list)
    print(f"安装成功: {app_name} ({package_name})")
    return 0

def cmd_uninstall(args):
    if len(args) < 2:
        print("用法: rtos.py uninstall <drive> <index>")
        return 1
    drive = args[0]
    index = int(args[1]) - 1
    app_list = get_app_list(drive)
    if index < 0 or index >= len(app_list):
        print("无效的序号")
        return 1
    app = app_list[index]
    package_name = app.get('packageName', '')
    app_name = app.get('appName', '')
    print(f"应用名称: {app_name}")
    print(f"包名: {package_name}")
    choice = input("确认卸载？(y/n): ")
    if choice.lower() != 'y':
        print("已取消卸载")
        return 0
    print(f"正在卸载: {app_name} ({package_name})...")
    for path_key in ['installPath', 'dataPath', 'rpkPath']:
        path = app.get(path_key, '')
        if path and os.path.exists(path):
            if os.path.isdir(path):
                shutil.rmtree(path, ignore_errors=True)
            else:
                os.remove(path)
    app_list.pop(index)
    save_app_list(drive, app_list)
    print("卸载成功")
    return 0

def cmd_list(args):
    if len(args) < 1:
        print("用法: rtos.py list <drive>")
        return 1
    drive = args[0]
    app_list = get_app_list(drive)
    print("-" * 60)
    print(f"应用总数: {len(app_list)}")
    print("-" * 60)
    for i, app in enumerate(app_list, 1):
        name = app.get('appName', '未知')
        pkg = app.get('packageName', 'unknown')
        ver = app.get('version', '1.0.0')
        is_hide = app.get('isHide', 0)
        hide_tag = ' [隐藏]' if is_hide == 1 else ''
        print(f"  {i}. {name} [{pkg}] {ver}{hide_tag}")
    print("-" * 60)
    return 0

def cmd_export(args):
    if len(args) < 2:
        print("用法: rtos.py export <drive> <export_dir> [index]")
        return 1
    drive = args[0]
    export_dir = args[1]
    index = int(args[2]) - 1 if len(args) > 2 else -1
    os.makedirs(export_dir, exist_ok=True)
    app_list = get_app_list(drive)
    if index >= 0:
        apps = [app_list[index]] if index < len(app_list) else []
    else:
        apps = app_list
    if not apps:
        print("没有可导出的应用")
        return 1
    for app in apps:
        pkg = app.get('packageName', 'unknown')
        name = app.get('appName', '未知')
        rpk_path = app.get('rpkPath', '')
        install_path = app.get('installPath', '')
        export_file = os.path.join(export_dir, f'{pkg}.rpk')
        if rpk_path and os.path.exists(rpk_path):
            shutil.copy2(rpk_path, export_file)
            print(f"导出成功: {name} -> {export_file}")
            continue
        if install_path and os.path.exists(install_path):
            print(f"正在从安装目录打包: {name}...")
            try:
                with zipfile.ZipFile(export_file, 'w') as zf:
                    for root, dirs, files in os.walk(install_path):
                        for f in files:
                            fp = os.path.join(root, f)
                            arcname = os.path.relpath(fp, install_path)
                            zf.write(fp, arcname)
                print(f"打包成功: {name} -> {export_file}")
                continue
            except Exception as e:
                print(f"打包失败: {e}")
        print(f"警告: {name} 的 RPK 文件不存在且无法打包")
    return 0

def cmd_com_list(args=None):
    try:
        ports = serial.tools.list_ports.comports()
        if not ports:
            print("NO_PORTS")
        for port in ports:
            print(port.device)
        return 0
    except:
        print("NO_PORTS")
        return 1

def cmd_at(args):
    if len(args) < 3:
        print("用法: rtos.py at <com_port> <baud_rate> <command> [message]")
        return 1
    com_port = args[0]
    baud_rate = int(args[1])
    command = args[2]
    message = args[3] if len(args) > 3 else None
    try:
        ser = serial.Serial(com_port, baud_rate, timeout=5)
        time.sleep(0.5)
        ser.write((command + '\r\n').encode())
        time.sleep(0.5)
        if message:
            ser.write((message + '\r\n').encode())
            time.sleep(0.5)
            ser.write(b'\x1a')
            time.sleep(1)
        response = ser.read(ser.in_waiting or 4096).decode('utf-8', errors='ignore')
        print(response)
        ser.close()
        return 0
    except Exception as e:
        print(f"ERROR: {e}")
        return 1

def cmd_gui(args):
    if len(args) < 1:
        drive = detect_drive()
    else:
        drive = args[0]
    if not drive:
        print("未检测到XTC设备")
        return 1
    app_list = get_app_list(drive)
    html = '''<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>快应用管理</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #1a1a2e; color: #eee; font-family: -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif; padding: 20px; }
.container { max-width: 1200px; margin: 0 auto; }
.header { text-align: center; padding: 20px 0 30px 0; border-bottom: 1px solid #333; }
.header h1 { color: #4fc3f7; font-size: 28px; }
.header p { color: #888; margin-top: 8px; }
.menu-bar { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; padding: 10px 0; }
.menu-btn { background: #2d2d44; border: 1px solid #444; color: #ccc; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-size: 13px; transition: all 0.2s; font-family: inherit; }
.menu-btn:hover { background: #4fc3f7; color: #1a1a2e; border-color: #4fc3f7; }
.menu-btn.danger:hover { background: #ef5350; border-color: #ef5350; color: #fff; }
.menu-btn.primary { background: #4fc3f7; color: #1a1a2e; border-color: #4fc3f7; }
.menu-btn.primary:hover { background: #29b6f6; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; padding: 20px 0; }
.card { background: #2d2d44; border-radius: 12px; padding: 16px; transition: transform 0.2s; border: 1px solid transparent; }
.card:hover { transform: translateY(-4px); border-color: #4fc3f7; }
.card-icon { width: 56px; height: 56px; border-radius: 12px; background: #1a1a2e; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; font-size: 28px; font-weight: bold; color: #4fc3f7; overflow: hidden; }
.card-icon img { width: 100%; height: 100%; object-fit: cover; }
.card-name { text-align: center; font-size: 14px; font-weight: 500; margin-bottom: 4px; color: #eee; }
.card-pkg { text-align: center; font-size: 11px; color: #777; word-break: break-all; }
.card-ver { text-align: center; font-size: 11px; color: #555; margin-top: 4px; }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>快应用管理</h1>
        <p>共 ''' + str(len(app_list)) + ''' 个应用</p>
    </div>
    <div class="menu-bar">
        <button class="menu-btn primary" onclick="window.pywebview.api.install()">安装应用</button>
        <button class="menu-btn danger" onclick="window.pywebview.api.uninstall()">卸载应用</button>
        <button class="menu-btn" onclick="window.pywebview.api.refresh()">刷新列表</button>
        <button class="menu-btn" onclick="window.pywebview.api.export_all()">导出全部</button>
    </div>
    <div class="grid" id="appGrid">
'''
    for app in app_list:
        name = app.get('appName', '未知')
        pkg = app.get('packageName', '')
        ver = app.get('version', '1.0.0')
        icon_path = app.get('iconPath', '')
        icon_html = ''
        if icon_path and os.path.exists(icon_path):
            try:
                with open(icon_path, 'rb') as f:
                    img_data = base64.b64encode(f.read()).decode()
                icon_html = f'<img src="data:image/png;base64,{img_data}" />'
            except:
                icon_html = name[0].upper()
        else:
            icon_html = name[0].upper() if name else '?'
        html += f'''
        <div class="card">
            <div class="card-icon">{icon_html}</div>
            <div class="card-name">{name}</div>
            <div class="card-pkg">{pkg}</div>
            <div class="card-ver">v{ver}</div>
        </div>
'''
    html += '''
    </div>
</div>
</body>
</html>'''
    class WebViewAPI:
        def __init__(self, window, drive):
            self.window = window
            self.drive = drive
        def refresh(self):
            app_list = get_app_list(self.drive)
            new_html = self.generate_html(app_list)
            self.window.load_html(new_html)
        def generate_html(self, app_list):
            html_content = '''<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>快应用管理</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #1a1a2e; color: #eee; font-family: "Microsoft YaHei", sans-serif; padding: 20px; }
.container { max-width: 1200px; margin: 0 auto; }
.header { text-align: center; padding: 20px 0 30px 0; border-bottom: 1px solid #333; }
.header h1 { color: #4fc3f7; font-size: 28px; }
.header p { color: #888; margin-top: 8px; }
.menu-bar { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; padding: 10px 0; }
.menu-btn { background: #2d2d44; border: 1px solid #444; color: #ccc; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-size: 13px; transition: all 0.2s; font-family: inherit; }
.menu-btn:hover { background: #4fc3f7; color: #1a1a2e; border-color: #4fc3f7; }
.menu-btn.danger:hover { background: #ef5350; border-color: #ef5350; color: #fff; }
.menu-btn.primary { background: #4fc3f7; color: #1a1a2e; border-color: #4fc3f7; }
.menu-btn.primary:hover { background: #29b6f6; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; padding: 20px 0; }
.card { background: #2d2d44; border-radius: 12px; padding: 16px; transition: transform 0.2s; border: 1px solid transparent; }
.card:hover { transform: translateY(-4px); border-color: #4fc3f7; }
.card-icon { width: 56px; height: 56px; border-radius: 12px; background: #1a1a2e; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; font-size: 28px; font-weight: bold; color: #4fc3f7; overflow: hidden; }
.card-icon img { width: 100%; height: 100%; object-fit: cover; }
.card-name { text-align: center; font-size: 14px; font-weight: 500; margin-bottom: 4px; color: #eee; }
.card-pkg { text-align: center; font-size: 11px; color: #777; word-break: break-all; }
.card-ver { text-align: center; font-size: 11px; color: #555; margin-top: 4px; }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>快应用管理</h1>
        <p>共 ''' + str(len(app_list)) + ''' 个应用</p>
    </div>
    <div class="menu-bar">
        <button class="menu-btn primary" onclick="window.pywebview.api.install()">安装应用</button>
        <button class="menu-btn danger" onclick="window.pywebview.api.uninstall()">卸载应用</button>
        <button class="menu-btn" onclick="window.pywebview.api.refresh()">刷新列表</button>
        <button class="menu-btn" onclick="window.pywebview.api.export_all()">导出全部</button>
    </div>
    <div class="grid">
'''
            for app in app_list:
                name = app.get('appName', '未知')
                pkg = app.get('packageName', '')
                ver = app.get('version', '1.0.0')
                icon_path = app.get('iconPath', '')
                icon_html = ''
                if icon_path and os.path.exists(icon_path):
                    try:
                        with open(icon_path, 'rb') as f:
                            img_data = base64.b64encode(f.read()).decode()
                        icon_html = f'<img src="data:image/png;base64,{img_data}" />'
                    except:
                        icon_html = name[0].upper()
                else:
                    icon_html = name[0].upper() if name else '?'
                html_content += f'''
        <div class="card">
            <div class="card-icon">{icon_html}</div>
            <div class="card-name">{name}</div>
            <div class="card-pkg">{pkg}</div>
            <div class="card-ver">v{ver}</div>
        </div>
'''
            html_content += '''
    </div>
</div>
</body>
</html>'''
            return html_content
        def install(self):
            root = tk.Tk()
            root.withdraw()
            root.attributes('-topmost', True)
            file_path = filedialog.askopenfilename(
                title="选择 RPK/ZIP 文件",
                filetypes=[("RPK/ZIP 文件", "*.rpk;*.zip"), ("所有文件", "*.*")]
            )
            root.destroy()
            if file_path:
                cmd_install([file_path, self.drive])
                self.refresh()
        def uninstall(self):
            root = tk.Tk()
            root.withdraw()
            root.attributes('-topmost', True)
            app_list = get_app_list(self.drive)
            if not app_list:
                messagebox.showinfo("提示", "没有已安装的应用")
                root.destroy()
                return
            choices = [f"{i+1}. {a.get('appName', '未知')} ({a.get('packageName', '')})" 
                       for i, a in enumerate(app_list)]
            result = simpledialog.askinteger(
                "卸载应用", 
                "选择要卸载的应用序号:\n\n" + "\n".join(choices),
                minvalue=1, maxvalue=len(app_list)
            )
            root.destroy()
            if result:
                cmd_uninstall([self.drive, result])
                self.refresh()
        def export_all(self):
            root = tk.Tk()
            root.withdraw()
            root.attributes('-topmost', True)
            export_dir = filedialog.askdirectory(title="选择导出目录")
            root.destroy()
            if export_dir:
                cmd_export([self.drive, export_dir])
    window = webview.create_window(
        "快应用管理",
        html=html,
        width=900,
        height=700,
        confirm_close=True
    )
    api = WebViewAPI(window, drive)
    window.js_api = api
    webview.start()
    return 0

def cmd_list_gui(args):
    if len(args) < 1:
        drive = detect_drive()
    else:
        drive = args[0]
    if not drive:
        print("未检测到 XTC 设备")
        return 1
    app_list = get_app_list(drive)


    import base64 as b64
    apps_data = []
    for a in app_list:
        icon_data = ''
        icon_path = a.get('iconPath', '')
        if icon_path and os.path.exists(icon_path):
            try:
                with open(icon_path, 'rb') as f:
                    img_bytes = f.read()
                    ext = os.path.splitext(icon_path)[1].lower()
                    mime = 'image/png'
                    if ext in ['.jpg', '.jpeg']:
                        mime = 'image/jpeg'
                    elif ext == '.gif':
                        mime = 'image/gif'
                    elif ext == '.bmp':
                        mime = 'image/bmp'
                    icon_data = f"data:{mime};base64,{b64.b64encode(img_bytes).decode()}"
            except:
                pass
        apps_data.append({
            'name': a.get('appName', '未知'),
            'pkg': a.get('packageName', ''),
            'ver': a.get('version', '1.0.0'),
            'verCode': a.get('versionCode', 1),
            'installPath': a.get('installPath', ''),
            'installTime': format_time(a.get('installTime', 0)),
            'isHide': a.get('isHide', 0),
            'installType': a.get('installType', 0),
            'size': format_size(a.get('installPath', '')),
            'iconData': icon_data,
        })

    apps_json = json.dumps(apps_data)

    html = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>已安装应用列表</title>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{ background: #1a1a2e; color: #eee; font-family: "Microsoft YaHei", sans-serif; padding: 20px; }}
.container {{ max-width: 1200px; margin: 0 auto; }}
h2 {{ color: #4fc3f7; padding: 15px 0; border-bottom: 1px solid #333; }}
.count {{ color: #888; font-size: 14px; margin-top: 10px; }}
.grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; padding: 20px 0; }}
.card {{ background: #2d2d44; border-radius: 12px; padding: 16px; transition: transform 0.2s; border: 1px solid transparent; cursor: pointer; position: relative; }}
.card:hover {{ transform: translateY(-4px); border-color: #4fc3f7; }}
.card-icon {{ width: 56px; height: 56px; border-radius: 12px; background: #1a1a2e; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; font-size: 28px; font-weight: bold; color: #4fc3f7; overflow: hidden; }}
.card-icon img {{ width: 100%; height: 100%; object-fit: cover; }}
.card-name {{ text-align: center; font-size: 14px; font-weight: 500; margin-bottom: 4px; color: #eee; }}
.card-pkg {{ text-align: center; font-size: 11px; color: #777; word-break: break-all; }}
.card-ver {{ text-align: center; font-size: 11px; color: #555; margin-top: 4px; }}
.card-size {{ text-align: center; font-size: 10px; color: #444; margin-top: 2px; }}
.card-hidden {{ position: absolute; top: 8px; right: 8px; background: #ef5350; color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 10px; }}
.card-type {{ position: absolute; top: 8px; left: 8px; background: #4fc3f7; color: #1a1a2e; font-size: 10px; padding: 2px 8px; border-radius: 10px; }}
.modal-overlay {{
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}}
.modal-overlay.active {{
    display: flex;
}}
.modal {{
    background: #2d2d44;
    border-radius: 16px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
}}
.modal-close {{
    position: absolute;
    top: 10px;
    right: 15px;
    color: #888;
    font-size: 24px;
    cursor: pointer;
    background: none;
    border: none;
}}
.modal-close:hover {{ color: #fff; }}
.modal-icon {{ width: 80px; height: 80px; border-radius: 16px; background: #1a1a2e; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 40px; color: #4fc3f7; overflow: hidden; }}
.modal-icon img {{ width: 100%; height: 100%; object-fit: cover; }}
.modal-name {{ text-align: center; font-size: 20px; font-weight: bold; color: #4fc3f7; }}
.modal-pkg {{ text-align: center; font-size: 13px; color: #888; margin: 4px 0; }}
.modal-ver {{ text-align: center; font-size: 13px; color: #666; }}
.modal-info {{ margin-top: 16px; }}
.modal-info .row {{ display: flex; padding: 6px 0; border-bottom: 1px solid #222; }}
.modal-info .label {{ color: #888; width: 100px; flex-shrink: 0; }}
.modal-info .value {{ color: #eee; }}
</style>
</head>
<body>
<div class="container">
<h2>已安装应用列表</h2>
<div class="count">共 {len(app_list)} 个应用</div>
<div class="grid" id="grid">
'''
    for idx, app in enumerate(app_list):
        name = app.get('appName', '未知')
        pkg = app.get('packageName', '')
        ver = app.get('version', '1.0.0')
        icon_path = app.get('iconPath', '')
        is_hide = app.get('isHide', 0)
        install_type = app.get('installType', 0)
        install_path = app.get('installPath', '')
        size = format_size(install_path) if install_path else '未知'
        install_map = {1: '预置', 2: '系统'}
        install_label = install_map.get(install_type, '')
        # 卡片图标使用 base64 数据（如果有）
        icon_data = apps_data[idx].get('iconData', '')
        if icon_data:
            icon_html = f'<img src="{icon_data}" />'
        else:
            icon_html = name[0].upper() if name else '?'
        hidden_html = '<span class="card-hidden">隐藏</span>' if is_hide == 1 else ''
        type_html = f'<span class="card-type">{install_label}</span>' if install_label else ''
        html += f'''
        <div class="card" onclick="showDetail({idx})">
            {hidden_html}
            {type_html}
            <div class="card-icon">{icon_html}</div>
            <div class="card-name">{name}</div>
            <div class="card-pkg">{pkg}</div>
            <div class="card-ver">v{ver}</div>
            <div class="card-size">{size}</div>
        </div>
'''
    html += f'''
</div>
</div>
<div class="modal-overlay" id="modalOverlay">
    <div class="modal">
        <button class="modal-close" onclick="closeModal()">×</button>
        <div id="modalContent"></div>
    </div>
</div>
<script>
var appsData = {apps_json};
function showDetail(idx) {{
    var app = appsData[idx];
    if (!app) return;
    var iconHtml = '';
    if (app.iconData) {{
        iconHtml = '<img src="' + app.iconData + '" />';
    }} else {{
        iconHtml = app.name.charAt(0).toUpperCase();
    }}
    var typeMap = {{1:'预置', 2:'系统'}};
    var typeLabel = typeMap[app.installType] || '未知';
    var html = '';
    html += '<div class="modal-icon">' + iconHtml + '</div>';
    html += '<div class="modal-name">' + app.name + '</div>';
    html += '<div class="modal-pkg">包名: ' + app.pkg + '</div>';
    html += '<div class="modal-ver">版本: v' + app.ver + ' (' + app.verCode + ')</div>';
    html += '<div class="modal-info">';
    html += '<div class="row"><span class="label">安装路径</span><span class="value">' + app.installPath + '</span></div>';
    html += '<div class="row"><span class="label">应用大小</span><span class="value">' + app.size + '</span></div>';
    html += '<div class="row"><span class="label">安装时间</span><span class="value">' + app.installTime + '</span></div>';
    html += '<div class="row"><span class="label">状态</span><span class="value">' + (app.isHide ? '已隐藏' : '正常') + '</span></div>';
    html += '<div class="row"><span class="label">类型</span><span class="value">' + typeLabel + '</span></div>';
    html += '</div>';
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('active');
}}
function closeModal() {{
    document.getElementById('modalOverlay').classList.remove('active');
}}
document.getElementById('modalOverlay').addEventListener('click', function(e) {{
    if (e.target === this) closeModal();
}});
</script>
</body>
</html>'''
    webview.create_window("已安装应用列表", html=html, width=900, height=700)
    webview.start()
    return 0


def cmd_personal(args):
    if len(args) < 1:
        print("用法: rtos.py personal <drive>")
        return 1
    drive = args[0]
    json_path = os.path.join(drive, 'personalCenter', 'myUniteInfo.json')
    if not os.path.exists(json_path):
        print("个人中心缓存文件不存在")
        return 1
    with open(json_path, 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
    account = data.get('data', {}).get('geniusAccount', {})
    personal = data.get('data', {}).get('personalInfo', {})
    medals = data.get('data', {}).get('simpleMedal', {}).get('medals', [])
    html = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>个人中心</title>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{ background: #1a1a2e; color: #eee; font-family: "Microsoft YaHei", sans-serif; padding: 20px; }}
.container {{ max-width: 1000px; margin: 0 auto; }}
h2 {{ color: #4fc3f7; padding: 15px 0; border-bottom: 1px solid #333; }}
.section {{ background: #2d2d44; border-radius: 12px; padding: 20px; margin: 15px 0; }}
.row {{ display: flex; padding: 6px 0; border-bottom: 1px solid #222; }}
.label {{ color: #888; width: 180px; flex-shrink: 0; }}
.value {{ color: #eee; }}
.sub-title {{ color: #4fc3f7; font-size: 16px; margin: 12px 0 10px 0; }}
.medal-grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 10px; padding: 10px 0; }}
.medal-item {{ background: #1a1a2e; border-radius: 8px; padding: 10px; text-align: center; font-size: 12px; color: #888; }}
.medal-item img {{ width: 48px; height: 48px; border-radius: 8px; display: block; margin: 0 auto 6px auto; }}
</style>
</head>
<body>
<div class="container">
<h2>个人中心</h2>
<div class="section">
<h3 style="color:#4fc3f7;margin-bottom:12px;">账号信息</h3>
<div class="row"><span class="label">ID</span><span class="value">{account.get('id', '-')}</span></div>
<div class="row"><span class="label">MobileID</span><span class="value">{account.get('mobileId', '-')}</span></div>
<div class="row"><span class="label">WatchID</span><span class="value">{account.get('watchId', '-')}</span></div>
<div class="row"><span class="label">BindNumber</span><span class="value">{account.get('bindNumber', '-')}</span></div>
<div class="row"><span class="label">天才号</span><span class="value">{account.get('geniusNumber', '-')}</span></div>
<div class="row"><span class="label">是否登录</span><span class="value">{'是' if account.get('isLogin') else '否'}</span></div>
<div class="row"><span class="label">创建时间</span><span class="value">{format_time(account.get('createTime', 0))}</span></div>
<div class="row"><span class="label">更新时间</span><span class="value">{format_time(account.get('updateTime', 0))}</span></div>
<div class="row"><span class="label">昵称</span><span class="value">{account.get('name', '-')}</span></div>
<div class="row"><span class="label">真实姓名</span><span class="value">{account.get('realName', '-')}</span></div>
<div class="row"><span class="label">型号</span><span class="value">{account.get('model', '-')}</span></div>
<div class="row"><span class="label">积分</span><span class="value">{account.get('score', 0)}</span></div>
<div class="row"><span class="label">好友数</span><span class="value">{account.get('friends', 0)}</span></div>
<div class="row"><span class="label">联系人</span><span class="value">{account.get('contacts', 0)}</span></div>
<div class="row"><span class="label">等级</span><span class="value">{account.get('level', 0)}</span></div>
<div class="row"><span class="label">头像</span><span class="value">{account.get('icon', '-')}</span></div>
<div class="row"><span class="label">关联号码</span><span class="value">{account.get('associatedNumber', '-')}</span></div>
<div class="row"><span class="label">号码</span><span class="value">{account.get('number', '-')}</span></div>
<div class="row"><span class="label">AuthID</span><span class="value">{account.get('authId', '-')}</span></div>
<div class="row"><span class="label">年级</span><span class="value">{account.get('grade', 0)}</span></div>
<div class="row"><span class="label">性别</span><span class="value">{'女' if account.get('gender') == 1 else '男' if account.get('gender') == 0 else '-'}</span></div>
<div class="row"><span class="label">生日</span><span class="value">{format_time(account.get('birthday', 0))}</span></div>
<div class="row"><span class="label">国家代码</span><span class="value">{account.get('countryCode', '-')}</span></div>
<div class="row"><span class="label">ID列表</span><span class="value">{account.get('idList', '-')}</span></div>
<div class="row"><span class="label">内部型号</span><span class="value">{account.get('innerModel', '-')}</span></div>
<div class="row"><span class="label">班级</span><span class="value">{account.get('classes', 0)}</span></div>
<div class="row"><span class="label">权益卡数量</span><span class="value">{account.get('cloudCardCount', 0)}</span></div>
<div class="row"><span class="label">检查不良</span><span class="value">{account.get('shouldCheckBad', 0)}</span></div>
<div class="row"><span class="label">称呼</span><span class="value">{account.get('salutation', '-')}</span></div>
<div class="row"><span class="label">机器ID</span><span class="value">{account.get('machineId', '-')}</span></div>
<div class="row"><span class="label">管理员称呼</span><span class="value">{account.get('adminSalutation', '-')}</span></div>
<div class="row"><span class="label">身高</span><span class="value">{account.get('height', 0)}</span></div>
<div class="row"><span class="label">体重</span><span class="value">{account.get('doubleWeight', 0)}</span></div>
</div>
<div class="section">
<h3 style="color:#4fc3f7;margin-bottom:12px;">个人信息</h3>
<div class="row"><span class="label">获赞数</span><span class="value">{personal.get('likes', 0)}</span></div>
<div class="row"><span class="label">模糊获赞</span><span class="value">{personal.get('fuzzyLikes', '-')}</span></div>
<div class="row"><span class="label">获赞上限</span><span class="value">{personal.get('likesLimitNumber', 0)}</span></div>
<div class="row"><span class="label">个性签名</span><span class="value">{personal.get('signature', '-')}</span></div>
<div class="row"><span class="label">点赞限制</span><span class="value">{personal.get('likeLimit', 0)}</span></div>
<div class="row"><span class="label">剩余点赞</span><span class="value">{personal.get('restLikes', 0)}</span></div>
<div class="row"><span class="label">主页展示点赞</span><span class="value">{personal.get('talentshowlike', 0)}</span></div>
</div>
<div class="section">
<h3 style="color:#4fc3f7;margin-bottom:12px;">勋章列表 (共 {len(medals)} 个)</h3>
<div class="medal-grid">
'''
    for medal in medals:
        medal_id = medal.get('medalId', '')
        icon_url = medal.get('icon', '')
        html += f'<div class="medal-item"><img src="{icon_url}" /><br>ID:{medal_id}</div>'
    html += '''
</div>
</div>
</div>
</body>
</html>'''
    webview.create_window("个人中心", html=html, width=950, height=700)
    webview.start()
    return 0

def cmd_call(args):
    if len(args) < 1:
        print("用法: rtos.py call <drive>")
        return 1
    drive = args[0]
    json_path = os.path.join(drive, 'callRecord', 'call_record.json')
    if not os.path.exists(json_path):
        print("暂无通话记录")
        return 1
    with open(json_path, 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
    rows = []
    dates = data.get('date', [])
    for date_key in sorted(dates, reverse=True):
        day_data = data.get(date_key, {})
        for number in day_data.get('pN', []):
            contact = day_data.get(number, {})
            display_name = contact.get('nM', '') or number
            for call in contact.get('cA', []):
                rows.append({
                    'time': format_time(call.get('sT', 0)),
                    'name': display_name,
                    'number': number,
                    'type': '呼出',
                    'status': '已接通' if call.get('cD', 0) > 0 else '未接通',
                    'duration': f"{call.get('cD', 0)}秒"
                })
            for call in contact.get('cM', []):
                rows.append({
                    'time': format_time(call.get('sT', 0)),
                    'name': display_name,
                    'number': number,
                    'type': '呼入',
                    'status': '未接' if call.get('oT', 0) == 1 else '已接通',
                    'duration': f"{call.get('oT', 0)}秒"
                })
    html = '''<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>通话记录</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #1a1a2e; color: #eee; font-family: "Microsoft YaHei", sans-serif; padding: 20px; }
.container { max-width: 1000px; margin: 0 auto; }
h2 { color: #4fc3f7; padding: 15px 0; border-bottom: 1px solid #333; }
.count { color: #888; margin-top: 10px; }
.table { width: 100%; border-collapse: collapse; margin-top: 15px; }
.th { background: #2d2d44; padding: 12px 10px; text-align: left; color: #888; font-weight: normal; border-bottom: 2px solid #444; }
.td { padding: 10px; border-bottom: 1px solid #222; }
.status-ok { color: #66bb6a; }
.status-miss { color: #ef5350; }
.type-out { color: #4fc3f7; }
.type-in { color: #ffa726; }
</style>
</head>
<body>
<div class="container">
<h2>通话记录</h2>
<div class="count">共 ''' + str(len(rows)) + ''' 条记录</div>
<table class="table">
<tr>
<th class="th">时间</th>
<th class="th">联系人</th>
<th class="th">号码</th>
<th class="th">类型</th>
<th class="th">状态</th>
<th class="th">时长</th>
</tr>
'''
    for row in rows:
        type_class = 'type-out' if row['type'] == '呼出' else 'type-in'
        status_class = 'status-ok' if row['status'] == '已接通' else 'status-miss'
        html += f'''
<tr>
<td class="td">{row['time']}</td>
<td class="td">{row['name']}</td>
<td class="td">{row['number']}</td>
<td class="td {type_class}">{row['type']}</td>
<td class="td {status_class}">{row['status']}</td>
<td class="td">{row['duration']}</td>
</tr>
'''
    html += '''
</table>
</div>
</body>
</html>'''
    webview.create_window("通话记录", html=html, width=1000, height=600)
    webview.start()
    return 0

def cmd_photo(args):
    if len(args) < 1:
        print("用法: rtos.py photo <drive>")
        return 1
    drive = args[0]
    photos_dir = None
    for d in ['Photos', 'DCIM', 'Pictures']:
        test_path = os.path.join(drive, d)
        if os.path.exists(test_path):
            photos_dir = test_path
            break
    if not photos_dir:
        print("未找到相册目录")
        return 1
    images = []
    for root, dirs, files in os.walk(photos_dir):
        for f in files:
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                images.append(os.path.join(root, f))
    if not images:
        print("没有找到图片")
        return 1

    global _photo_data
    _photo_data = {
        'images': images,
        'base_dir': photos_dir
    }

    html = '''<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>相册</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #1a1a2e; color: #eee; font-family: "Microsoft YaHei", sans-serif; padding: 20px; }
.container { max-width: 1200px; margin: 0 auto; }
.header { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #333; }
h2 { color: #4fc3f7; }
.count { color: #888; }
.btn { background: #4fc3f7; color: #1a1a2e; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; margin-left: 10px; }
.btn:hover { background: #29b6f6; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; padding: 20px 0; }
.img-card { background: #2d2d44; border-radius: 8px; overflow: hidden; aspect-ratio: 1; cursor: pointer; position: relative; border: 3px solid transparent; }
.img-card.selected { border-color: #4fc3f7; }
.img-card img { width: 100%; height: 100%; object-fit: cover; }
.img-card .check { position: absolute; top: 5px; right: 5px; background: #4fc3f7; color: #1a1a2e; border-radius: 50%; width: 24px; height: 24px; display: none; align-items: center; justify-content: center; font-size: 14px; }
.img-card.selected .check { display: flex; }
</style>
</head>
<body>
<div class="container">
<div class="header">
<h2>相册</h2>
<div class="count">共 ''' + str(len(images)) + ''' 张图片</div>
</div>
<div class="header" style="border-bottom: none; padding-top: 0;">
<button class="btn" onclick="exportSelected()">导出选中</button>
<button class="btn" onclick="exportAll()">导出全部</button>
<button class="btn" id="toggleBtn" onclick="toggleAll()">全选</button>
</div>
<div class="grid" id="grid">
'''
    for idx, img in enumerate(images):
        try:
            with open(img, 'rb') as f:
                img_data = base64.b64encode(f.read()).decode()
            html += f'''
<div class="img-card" data-index="{idx}" onclick="toggleSelect({idx})">
    <img src="data:image/png;base64,{img_data}" />
    <div class="check">✓</div>
</div>'''
        except:
            pass
    html += '''
</div>
</div>
<script>
var selected = new Set();
var total = ''' + str(len(images)) + ''';
function toggleSelect(index) {
    var el = document.querySelector('.img-card[data-index="' + index + '"]');
    if (selected.has(index)) {
        selected.delete(index);
        el.classList.remove('selected');
    } else {
        selected.add(index);
        el.classList.add('selected');
    }
    updateToggleButton();
}
function toggleAll() {
    if (selected.size === total) {
        selected.clear();
        document.querySelectorAll('.img-card').forEach(function(el) {
            el.classList.remove('selected');
        });
        document.getElementById('toggleBtn').textContent = '全选';
    } else {
        for (var i = 0; i < total; i++) {
            selected.add(i);
        }
        document.querySelectorAll('.img-card').forEach(function(el) {
            el.classList.add('selected');
        });
        document.getElementById('toggleBtn').textContent = '取消全选';
    }
}
function updateToggleButton() {
    if (selected.size === total) {
        document.getElementById('toggleBtn').textContent = '取消全选';
    } else {
        document.getElementById('toggleBtn').textContent = '全选';
    }
}
function exportSelected() {
    var list = Array.from(selected);
    window.pywebview.api.export(JSON.stringify(list));
}
function exportAll() {
    var all = [];
    for (var i = 0; i < total; i++) {
        all.push(i);
    }
    window.pywebview.api.export(JSON.stringify(all));
}
</script>
</body>
</html>'''

    class PhotoAPI:
        def export(self, json_indices):
            try:
                indices = json.loads(json_indices)
            except:
                return
            if not indices:
                return
            if not webview.windows:
                return
            win = webview.windows[0]
            try:
                export_dir = win.create_file_dialog(
                    webview.FileDialog.FOLDER,
                    allow_multiple=False
                )
            except AttributeError:
                export_dir = win.create_file_dialog(
                    webview.FOLDER_DIALOG,
                    allow_multiple=False
                )
            if not export_dir:
                return
            export_dir = export_dir[0]
            os.makedirs(export_dir, exist_ok=True)
            count = 0
            images = _photo_data['images']
            base_dir = _photo_data['base_dir']
            for idx in indices:
                if idx < len(images):
                    src = images[idx]
                    rel_path = os.path.relpath(src, base_dir)
                    dest_path = os.path.join(export_dir, rel_path)
                    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                    shutil.copy2(src, dest_path)
                    count += 1
            win.create_confirmation_dialog("成功", f"已导出 {count} 张图片")

    api = PhotoAPI()
    window = webview.create_window(
        "相册",
        html=html,
        width=1000,
        height=700,
        js_api=api,
        confirm_close=True
    )
    webview.start()
    return 0

def cmd_store(args):
    apps_data = []
    error_msg = None
    try:
        response = requests.get('http://rtos.xtxt.xyz/api.php', timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('code') == 0:
                apps_data = data.get('data', [])
            else:
                error_msg = data.get('msg', '未知错误')
        else:
            error_msg = f'HTTP {response.status_code}'
    except Exception as e:
        error_msg = str(e)
    
    if error_msg:
        html = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>RPK商店</title>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{ background: #1a1a2e; color: #eee; font-family: "Microsoft YaHei", sans-serif; padding: 20px; }}
.container {{ max-width: 1200px; margin: 0 auto; }}
.header {{ text-align: center; padding: 20px 0 30px 0; border-bottom: 1px solid #333; }}
.header h1 {{ color: #4fc3f7; font-size: 28px; }}
.error {{ text-align: center; padding: 60px; color: #ef5350; font-size: 16px; }}
.btn {{ background: #4fc3f7; color: #1a1a2e; border: none; padding: 10px 30px; border-radius: 8px; cursor: pointer; font-size: 14px; margin-top: 20px; }}
.btn:hover {{ background: #29b6f6; }}
</style>
</head>
<body>
<div class="container">
<div class="header"><h1>RPK商店</h1></div>
<div class="error">加载失败: {error_msg}<br><br><button class="btn" onclick="location.reload()">重试</button></div>
</body>
</html>'''
    elif not apps_data:
        html = '''<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>RPK商店</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #1a1a2e; color: #eee; font-family: "Microsoft YaHei", sans-serif; padding: 20px; }
.container { max-width: 1200px; margin: 0 auto; }
.header { text-align: center; padding: 20px 0 30px 0; border-bottom: 1px solid #333; }
.header h1 { color: #4fc3f7; font-size: 28px; }
.empty { text-align: center; padding: 60px; color: #888; font-size: 16px; }
</style>
</head>
<body>
<div class="container">
<div class="header"><h1>RPK商店</h1></div>
<div class="empty">暂无应用</div>
</body>
</html>'''
    else:
        apps_json = json.dumps([{
            'name': app.get('name', '未知'),
            'pkg': app.get('package', ''),
            'ver': app.get('version', '1.0.0'),
            'icon': app.get('icon', ''),
            'desc': app.get('description', ''),
            'developer': app.get('developer', ''),
            'download': app.get('download', ''),
            'screenshot': app.get('screenshot', ''),
        } for app in apps_data])
        
        cards_html = ''
        for idx, app in enumerate(apps_data):
            name = app.get('name', '未知')
            pkg = app.get('package', '')
            ver = app.get('version', '1.0.0')
            icon = app.get('icon', '')
            desc = app.get('description', '')
            developer = app.get('developer', '')
            download = app.get('download', '')
            icon_html = f'<img src="{icon}" onerror="this.parentElement.textContent=\'{name[0].upper()}\'" />' if icon else name[0].upper()
            cards_html += f'''
            <div class="card" onclick="showDetail({idx})">
                <div class="card-icon">{icon_html}</div>
                <div class="card-name">{name}</div>
                <div class="card-pkg">{pkg}</div>
                <div class="card-ver">v{ver}</div>
                <div class="card-desc">{desc}</div>
                <div class="card-dev">{developer}</div>
                <a href="{download}" target="_blank" class="btn-install" onclick="event.stopPropagation();">下载</a>
            </div>'''
        
        html = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>RPK商店</title>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{ background: #1a1a2e; color: #eee; font-family: "Microsoft YaHei", sans-serif; padding: 20px; }}
.container {{ max-width: 1200px; margin: 0 auto; }}
.header {{ text-align: center; padding: 20px 0 30px 0; border-bottom: 1px solid #333; }}
.header h1 {{ color: #4fc3f7; font-size: 28px; }}
.header p {{ color: #888; margin-top: 8px; }}
.grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; padding: 20px 0; }}
.card {{ background: #2d2d44; border-radius: 12px; padding: 16px; transition: transform 0.2s; border: 1px solid transparent; cursor: pointer; }}
.card:hover {{ transform: translateY(-4px); border-color: #4fc3f7; }}
.card-icon {{ width: 64px; height: 64px; border-radius: 12px; background: #1a1a2e; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; font-size: 28px; font-weight: bold; color: #4fc3f7; overflow: hidden; }}
.card-icon img {{ width: 100%; height: 100%; object-fit: cover; }}
.card-name {{ text-align: center; font-size: 16px; font-weight: 500; margin-bottom: 4px; color: #eee; }}
.card-pkg {{ text-align: center; font-size: 11px; color: #777; word-break: break-all; }}
.card-ver {{ text-align: center; font-size: 11px; color: #555; margin-top: 4px; }}
.card-desc {{ text-align: center; font-size: 12px; color: #888; margin-top: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }}
.card-dev {{ text-align: center; font-size: 11px; color: #555; margin-top: 4px; }}
.btn-install {{ display: inline-block; margin: 10px auto 0 auto; background: #4fc3f7; color: #1a1a2e; border: none; padding: 6px 20px; border-radius: 6px; cursor: pointer; font-size: 13px; text-decoration: none; text-align: center; }}
.btn-install:hover {{ background: #29b6f6; }}
.modal-overlay {{
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}}
.modal-overlay.active {{
    display: flex;
}}
.modal {{
    background: #2d2d44;
    border-radius: 16px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
}}
.modal-close {{
    position: absolute;
    top: 10px;
    right: 15px;
    color: #888;
    font-size: 24px;
    cursor: pointer;
    background: none;
    border: none;
}}
.modal-close:hover {{ color: #fff; }}
.modal-icon {{ width: 80px; height: 80px; border-radius: 16px; background: #1a1a2e; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 40px; color: #4fc3f7; overflow: hidden; }}
.modal-icon img {{ width: 100%; height: 100%; object-fit: cover; }}
.modal-name {{ text-align: center; font-size: 20px; font-weight: bold; color: #4fc3f7; }}
.modal-pkg {{ text-align: center; font-size: 13px; color: #888; margin: 4px 0; }}
.modal-ver {{ text-align: center; font-size: 13px; color: #666; }}
.modal-info {{ margin-top: 16px; }}
.modal-info .row {{ display: flex; padding: 6px 0; border-bottom: 1px solid #222; }}
.modal-info .label {{ color: #888; width: 80px; flex-shrink: 0; }}
.modal-info .value {{ color: #eee; }}
.modal-screenshot {{ margin-top: 16px; text-align: center; }}
.modal-screenshot img {{ max-width: 100%; max-height: 300px; border-radius: 8px; border: 1px solid #444; }}
.modal-screenshot .no-img {{ color: #555; padding: 20px; }}
.modal-btn-install {{ display: inline-block; margin: 16px auto 0 auto; background: #4fc3f7; color: #1a1a2e; border: none; padding: 10px 40px; border-radius: 8px; cursor: pointer; font-size: 16px; text-decoration: none; text-align: center; }}
.modal-btn-install:hover {{ background: #29b6f6; }}
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1>RPK商店</h1>
<p>共 {len(apps_data)} 个应用</p>
</div>
<div class="grid">
{cards_html}
</div>
</div>
<div class="modal-overlay" id="modalOverlay">
    <div class="modal">
        <button class="modal-close" onclick="closeModal()">×</button>
        <div id="modalContent"></div>
    </div>
</div>
<script>
var appsData = {apps_json};

function showDetail(idx) {{
    var app = appsData[idx];
    if (!app) return;
    var iconHtml = '';
    if (app.icon) {{
        iconHtml = '<img src="' + app.icon + '" onerror="this.parentElement.textContent=app.name.charAt(0).toUpperCase()" />';
    }} else {{
        iconHtml = app.name.charAt(0).toUpperCase();
    }}
    var screenshotHtml = '';
    if (app.screenshot) {{
        screenshotHtml = '<img src="' + app.screenshot + '" onerror="this.parentElement.innerHTML=\'<div class=\\\'no-img\\\'>截图加载失败</div>\'" />';
    }} else {{
        screenshotHtml = '<div class="no-img">暂无截图</div>';
    }}
    var html = '';
    html += '<div class="modal-icon">' + iconHtml + '</div>';
    html += '<div class="modal-name">' + app.name + '</div>';
    html += '<div class="modal-pkg">包名: ' + app.pkg + '</div>';
    html += '<div class="modal-ver">版本: v' + app.ver + '</div>';
    html += '<div class="modal-info">';
    html += '<div class="row"><span class="label">开发者</span><span class="value">' + (app.developer || '未知') + '</span></div>';
    html += '<div class="row"><span class="label">描述</span><span class="value">' + (app.desc || '无描述') + '</span></div>';
    html += '</div>';
    html += '<div class="modal-screenshot"><p style="color:#888;font-size:12px;margin-bottom:8px;">截图预览</p>' + screenshotHtml + '</div>';
    html += '<a href="' + app.download + '" target="_blank" class="modal-btn-install" onclick="event.stopPropagation();">下载</a>';
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('active');
}}

function closeModal() {{
    document.getElementById('modalOverlay').classList.remove('active');
}}

document.getElementById('modalOverlay').addEventListener('click', function(e) {{
    if (e.target === this) closeModal();
}});
</script>
</body>
</html>'''
    
    window = webview.create_window(
        "RPK商店",
        html=html,
        width=1000,
        height=700,
        confirm_close=True
    )
    webview.start()
    return 0


def cmd_store_switch(args):
    if len(args) < 1:
        print("用法: rtos.py store_switch <drive>")
        return 1
    drive = args[0]
    json_path = os.path.join(drive, 'config', 'sub_module_switch.json')
    if not os.path.exists(json_path):
        print(f"配置文件不存在")
        return 1
    with open(json_path, 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
    switch_list = data.get('module_switch_list', [])
    found = False
    current_status = None
    for item in switch_list:
        if item.get('module') == 103 and item.get('package') == 'com.xtc.appcenter':
            found = True
            current_status = item.get('display', 0)
            break
    if not found:
        print("未找到应用商店配置项")
        return 1
    status_text = '开启' if current_status == 0 else '关闭'
    print(f"当前状态: {status_text}")
    print("1. 开启应用商店")
    print("2. 关闭应用商店")
    print("0. 返回")
    print()
    choice = input("请选择: ")
    if choice == '0':
        return 0
    elif choice == '1':
        new_status = 0
    elif choice == '2':
        new_status = 1
    else:
        print("无效选择")
        return 1
    for item in switch_list:
        if item.get('module') == 103 and item.get('package') == 'com.xtc.appcenter':
            item['display'] = new_status
            break
    data['module_switch_list'] = switch_list
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    status_text = '开启' if new_status == 0 else '关闭'
    print(f"应用商店已{status_text}，请重启手表生效")
    return 0

def cmd_check_deps(args=None):
    try:
        import serial
        import webview
        import requests
        return 0
    except ImportError:
        return 1

def main():
    if len(sys.argv) < 2:
        drive = detect_drive()
        if not drive:
            print("未检测到XTC设备")
            sys.exit(1)
        cmd_gui([drive])
        return
    command = sys.argv[1]
    args = sys.argv[2:]
    if command.endswith(':') and len(command) == 2:
        cmd_gui([command])
        return
    commands = {
        'usb': cmd_usb,
        'install': cmd_install,
        'uninstall': cmd_uninstall,
        'list': cmd_list,
        'list_gui': cmd_list_gui,
        'export': cmd_export,
        'at': cmd_at,
        'com_list': cmd_com_list,
        'photo': cmd_photo,
        'call': cmd_call,
        'personal': cmd_personal,
        'store': cmd_store,
        'store_switch': cmd_store_switch,
        'gui': cmd_gui,
        'check_deps': cmd_check_deps,
    }
    if command in commands:
        sys.exit(commands[command](args) or 0)
    else:
        print(f"未知命令: {command}")
        sys.exit(1)

if __name__ == '__main__':
    main()