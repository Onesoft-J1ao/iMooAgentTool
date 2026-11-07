@echo off
set "MODE=%~2"
set "MODULE_ID=%~1"

if "%MODULE_ID%"=="" exit /b 1

call adbdevice adb || exit /b 1
call adbdevice root
if errorlevel 1 (
    echo 没有root权限!
    exit /b 1
)

rem 检查模块是否存在
adb shell %suroot% "[ -d /data/adb/modules/%MODULE_ID% ]" 2>nul
if errorlevel 1 (
    echo 指定的模块不存在!
    exit /b 1
)

if /i "%MODE%"=="mark" (
    call :MarkRemove
) else if /i "%MODE%"=="direct" (
    call :DirectRemove
) else if /i "%MODE%"=="script" (
    call :ScriptRemove
) else (
    call :DirectRemove
)
exit /b %errorlevel%

:MarkRemove
adb shell %suroot% "touch /data/adb/modules/%MODULE_ID%/remove" >nul 2>&1
adb shell %suroot% "[ -f /data/adb/modules/%MODULE_ID%/remove ]" 2>nul
if errorlevel 1 (
    echo 为%MODULE_ID%模块创建标记卸载文件未成功!
    exit /b 1
)
exit /b 0

:DirectRemove
adb shell %suroot% "touch /data/adb/modules/%MODULE_ID%/disable && sleep 1 && rm -rf /data/adb/modules/%MODULE_ID%" >nul 2>&1
adb shell %suroot% "[ ! -d /data/adb/modules/%MODULE_ID% ]" 2>nul
if errorlevel 1 (
    echo 删除%MODULE_ID%模块目录未成功!
    exit /b 1
)
exit /b 0

:ScriptRemove
set "TEMP_OUT=rm_module_%RANDOM%_tmp.txt"
adb shell %suroot% "if [ -f /data/adb/modules/%MODULE_ID%/uninstall.sh ]; then sh /data/adb/modules/%MODULE_ID%/uninstall.sh; else echo NO_SCRIPT; fi; rm -rf /data/adb/modules/%MODULE_ID%" > "%TEMP_OUT%" 2>&1
adb shell %suroot% "[ ! -d /data/adb/modules/%MODULE_ID% ]" 2>nul
if errorlevel 1 (
    echo 删除%MODULE_ID%模块目录未成功!
    exit /b 1
)
findstr /i "NO_SCRIPT" "%TEMP_OUT%" >nul && (
    echo 警告: 没有找到 uninstall.sh 卸载脚本
)
del /q /f "%TEMP_OUT%" 2>nul
exit /b 0