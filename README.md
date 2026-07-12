# iMooAgentTool

XTC 电话手表工具箱 — 基于 iMooDesktop 原版 + AI Agent 智能助手

## 功能

### 设备管理
- **设备检测** — ADB / Fastboot / 9008 EDL 自动识别，支持 USB 热插拔 + 10 秒轮询
- **重启模式** — 9 种重启模式：系统重启、Bootloader、Recovery、EDL 深度刷机、TWRP 临时 Recovery、QMMI 诊断、FFBM 工厂模式、清除数据、FastbootD
- **Root 工具** — 完整 Root 工作流，支持 SDK19/25/27/ND03/ND08，一键获取手表 Root 权限

### 文件管理
- **ADB 文件浏览器** — 浏览、上传、下载、复制、重命名、删除手表文件
- **搜索** — 支持关键字搜索和批量操作
- **快捷路径** — 快速访问 sdcard、DCIM、Download 等常用目录

### 应用管理
- **APK 管理** — 安装、卸载应用
- **Z10 解锁** — 解除手表安装限制
- **自启动配置** — 配置 QQ、微信自启动

### 系统工具
- **充电模式** — 开启手表充电常亮
- **WiFi ADB** — 无线连接调试
- **OTA 升级** — 离线 OTA 刷机
- **驱动检测** — USB 驱动安装检测
- **ATBMod 模块** — .atbmod 模块管理
- **系统属性** — 读取 build.prop

### 备份恢复
- **DCIM 备份** — 照片备份与恢复
- **ADB-dd 备份** — 全分区备份恢复
- **EDL 9008 备份** — 深度刷机模式备份恢复
- **Super Recovery** — 一键式全量备份
- **TWRP** — TWRP 刷入
- **Xposed** — Xposed 框架安装

### Magisk 模块管理
- **模块列表** — 查看已安装模块
- **安装/卸载** — 三种安装/卸载方式
- **启用/停用** — 切换模块状态
- **模块商店** — 在线搜索和安装

### EDL 分区管理
- **GPT 查看** — 读取分区表
- **分区操作** — 备份/恢复/擦除/验证分区
- **edl-ng 支持** — 使用 edl-ng 工具

### AI Agent 智能助手
- **功能搜索** — 输入关键词快速定位软件功能，支持 AI 智能匹配（需配置 API）
- **自由对话** — 与 AI 自由聊天，获取使用帮助
- **独立窗口** — 按 Ctrl+Shift+A 或点击侧边栏 🤖 按钮打开
- **主题颜色** — 自定义应用主题色（在 AI 配置窗口中设置）

## 快速开始

### 下载安装

从 [Releases](https://github.com/Onesoft-J1ao/imooAgent/releases) 下载最新版本安装包。

### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/Onesoft-J1ao/imooAgent.git
cd imooAgent

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建安装包
npm run electron:build
```

### 配置 AI Agent

1. 打开 AI 助手（Ctrl+Shift+A 或点击侧边栏 🤖）
2. 点击 ⚙ 配置
3. 填写 API 地址（如 `https://api.openai.com/v1`）和 API Key
4. 选择模型（如 `gpt-4o-mini`）
5. 启用 AI Agent
6. 可选择「搜索功能」或「自由对话」模式

## 技术栈

- **框架**: Electron + React 18 + TypeScript
- **样式**: Tailwind CSS
- **图标**: lucide-react
- **状态管理**: Zustand
- **AI**: 兼容 OpenAI API 格式

## 注意

本工具仅供学习交流，严禁用于商业用途与手表强制解绑。

## 致谢

- 基于 [iMooDesktop](https://github.com/Kiruvex/iMooDesktop) 原版功能逻辑
- 参考 AllToolBox 业务逻辑
