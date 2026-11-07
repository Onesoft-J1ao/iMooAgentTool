# iMooAgentTool

<p align="center">
  <img src="resources/brand/banner.png" alt="iMooAgentTool" width="720">
</p>

<p align="center">
  XTC 电话手表工具箱 · Electron + React + TypeScript
</p>

<p align="center">
  <a href="https://github.com/Onesoft-J1ao/iMooAgentTool/releases">下载</a> ·
  <a href="#功能">功能</a> ·
  <a href="#开发">开发</a> ·
  <a href="#构建与发布">构建与发布</a>
</p>

## 简介

iMooAgentTool 是面向 XTC 电话手表的桌面工具箱，覆盖设备检测、重启模式、Root、文件管理、应用管理、Magisk 模块、备份恢复、EDL 分区操作和资源下载。界面使用 Electron + React 构建，设备操作通过 ADB、Fastboot 和 Qualcomm EDL 工具链完成。

项目参考 AllToolBox 的业务逻辑重新实现，不是原工具的简单套壳。参考文件位于 `reference/AllToolBox`，用于核对菜单、脚本和资源目录。

## 功能

### 设备与系统

- ADB、Fastboot、Qualcomm EDL 9008 自动检测，支持热插拔刷新
- 9 种重启模式：系统、Bootloader、Recovery、EDL、临时 TWRP、QMMI、FFBM、清除数据、FastbootD
- 读取型号、内部型号、Android/SDK 版本、软件版本、电量与存储信息
- 无线 ADB：切换 TCP 模式、连接、断开、配对
- 充电常亮、build.prop 读取、驱动检测与安装

### Root 与模块

- SDK 19 / 25 / 27 / ND03 / ND08 分支
- 按机型解压 Root 资源，EDL 刷入，等待设备回连，安装配套 APK 与模块
- 任务进度、阶段日志、暂停/继续/取消
- Magisk 模块列表、安装、卸载、启用/停用
- Magisk 模块商店搜索与安装
- ATBMod 模块扫描、安装、卸载

### 文件与应用

- ADB 文件浏览、上传、下载、复制、重命名、删除、搜索、权限修改
- 快捷路径与多设备切换
- APK 安装、卸载、启动、强制停止、清除数据
- Z10 安装限制解锁
- QQ / 微信开机自启设置

### 备份与恢复

- DCIM 相册备份/恢复
- ADB-dd 分区备份/恢复，自动跳过 userdata，支持 MD5 校验
- EDL 9008 分区备份/恢复、GPT 读取、逐分区擦除与校验
- TWRP 自动匹配刷入
- Xposed 安装（SDK 19 / 25）

### 资源与 AI 助手

- 云端资源列表、下载、解压、版本检测
- 兼容 OpenAI 格式的 AI 助手：功能搜索与自由对话
- 自定义 API 地址、Key、模型

## 界面

主界面按「设备工具 / 文件管理 / 系统工具 / 其他」分组。常用操作在左侧导航直接进入，耗时任务会在页面内显示进度与日志。

桌面图标和安装包图标来自 `resources/brand/icon-source.png`，构建时自动生成 ICO。

## 开发

环境要求：

- Node.js 20+
- npm 10+
- Windows 10/11（设备工具链依赖 Windows 可执行文件）

安装依赖：

```bash
npm install
```

启动开发模式：

```bash
npm run dev
```

类型检查：

```bash
npm run typecheck
```

## 构建与发布

本地构建 Windows 安装包与便携版：

```bash
npm run build
npm run dist
```

产物输出到 `release/`：

- `iMooAgentTool-<version>-setup.exe`
- `iMooAgentTool-<version>-portable.exe`

推送到 `main` 分支或创建 `v*` 标签时，GitHub Actions 会自动构建并上传 Release 附件。工作流位于 `.github/workflows/build.yml`。

## 目录结构

```text
src/                 React 界面
electron/            Electron 主进程、preload、IPC、设备服务
shared/              共享类型
resources/bin/       ADB、Fastboot、7z、scrcpy 等运行工具
resources/edl/       EDL loader、misc、分区 XML
resources/scripts/   设备端 shell 脚本
resources/brand/     README 品牌图与图标源文件
reference/           参考项目 AllToolBox
.github/workflows/   GitHub Actions 构建流水线
```

## 说明

- 设备操作会修改系统分区、引导状态或用户数据，请先备份并确认电量充足。
- Root、TWRP、Xposed、驱动等资源需要先在「资源管理」中下载。
- 仓库使用 Git LFS 管理二进制资源，克隆后执行 `git lfs pull`。

## 许可

GPL-3.0
