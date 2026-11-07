
setlocal enabledelayedexpansion
set args1=%~1
set args2=%~2
set args3=%~3
:callinst
echo %CYAN%正在安装：%RESET%%PINK%%args1%%RESET%

if not exist ".\tmp" mkdir ".\tmp"

if "%args2%"=="important" set /a retry=0 & goto important
if "%args2%"=="nostreaming" call adbdevice adb && adb install -r -t -d --no-streaming "%args1%" > ".\tmp\instapptmp.txt" 2>&1
if "%args2%"=="install" call adbdevice adb && adb install -r -t -d "%args1%" > ".\tmp\instapptmp.txt" 2>&1
if "%args2%"=="data" goto data
if "%args2%"=="create" goto create
if "%args2%"=="3install" goto 3install
call adbdevice adb
adb install -r -t -d "%args1%" > ".\tmp\instapptmp.txt" 2>&1
:instfind

if not exist ".\tmp\instapptmp.txt" %ERROR%发生错误，没有任何安装命令被调用，请检查语法是否正确 & goto error
find /i "Success" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %GREEN% 安装成功！%RESET%
    if exist ".\tmp\instapptmp.txt" del ".\tmp\instapptmp.txt" >nul 2>&1
    endlocal
    set /a SUCCESS+=1
    exit /b
) else goto error


:data
echo %INFO% 使用 data/app 安装方式...%RESET%

for %%A in ("%args1%") do set APK_NAME=%%~nxA


if not exist ".\tmp" mkdir ".\tmp"
echo %info%正在检查 root 权限...%RESET%
call adbdevice root
if "%errorlevel%"=="1" (
    ECHO.%error% 没有root权限
    goto error
)
call nutime
set "RANDOM_DIR=copydata-!nutime!!RANDOM!"
echo %INFO% 创建应用目录：/data/app/!RANDOM_DIR!%RESET%


adb shell %suroot% mkdir -p /data/app/!RANDOM_DIR! > ".\tmp\instapptmp.txt" 2>&1
if !errorlevel! neq 0 (
    echo %ERROR% 创建应用目录失败%RESET%
    type ".\tmp\instapptmp.txt" 2>nul

    goto error
)


echo %INFO% 推送APK文件到应用目录...%RESET%
call adbdevice adb
adb push "!args1!" /data/local/tmp/!APK_NAME! > ".\tmp\instapptmp.txt" 2>&1
if !errorlevel! neq 0 (
    echo %ERROR% 推送APK到临时目录失败%RESET%
    type ".\tmp\instapptmp.txt" 2>nul

    goto error
)


echo %INFO% 移动APK到应用目录...%RESET%
adb shell %suroot% mv /data/local/tmp/!APK_NAME! /data/app/!RANDOM_DIR!/base.apk > ".\tmp\instapptmp.txt" 2>&1
if !errorlevel! neq 0 (
    echo %ERROR% 移动APK文件失败%RESET%
    type ".\tmp\instapptmp.txt" 2>nul
    adb shell %suroot% rm -rf /data/app/!RANDOM_DIR! >nul 2>&1

    goto error
)


echo %INFO% 设置文件权限...%RESET%
adb shell %suroot% chmod 755 /data/app/!RANDOM_DIR! >nul 2>&1
adb shell %suroot% chmod 644 /data/app/!RANDOM_DIR!/base.apk >nul 2>&1


echo %INFO% 设置文件所有者...%RESET%
adb shell %suroot% chown system:system /data/app/!RANDOM_DIR!/ >nul 2>&1
adb shell %suroot% chown system:system /data/app/!RANDOM_DIR!/base.apk >nul 2>&1

echo %GREEN% APK已复制到/data/app/!RANDOM_DIR!/base.apk%RESET%

echo.
echo %YELLOW% data/app安装方式可能需要重启才能生效%RESET%

adb shell %suroot% rm -f /data/local/tmp/!APK_NAME! >nul 2>&1
echo %GREEN% data/app安装完成！%RESET%
echo %CYAN%应用路径：/data/app/!RANDOM_DIR!/base.apk%RESET%
if exist ".\tmp\instapptmp.txt" del ".\tmp\instapptmp.txt" >nul 2>&1
endlocal
set /a SUCCESS+=1
exit /b

:create
for %%A in ("%args1%") do set APK_SIZE=%%~zA
for %%A in ("%args1%") do set APK_NAME=%%~nxA

echo %INFO% 使用 pm install-create 安装...%RESET%

if not exist ".\tmp" mkdir ".\tmp"

set "SESSION_ID="
for /f "tokens=2 delims=[]" %%i in ('adb shell pm install-create -r -t -S !APK_SIZE!') do (
    set "SESSION_ID=%%i"
)

if "!SESSION_ID!"=="" (
    echo %ERROR% 创建安装会话失败%RESET%

    goto error
)

echo %INFO% 会话创建成功: [!SESSION_ID!]%RESET%


echo %INFO% 推送APK文件到设备...%RESET%
call adbdevice adb
adb push "!args1!" /data/local/tmp/!APK_NAME!


echo %INFO% 写入安装会话...%RESET%
adb shell pm install-write !SESSION_ID! base.apk /data/local/tmp/!APK_NAME!


echo %INFO% 提交安装...%RESET%
adb shell pm install-commit !SESSION_ID! > ".\tmp\instapptmp.txt" 2>&1
adb shell rm -f /data/local/tmp/!APK_NAME!
goto instfind

:3install

echo %INFO% 使用 第三方安装器 安装...%RESET%


if not exist ".\tmp" mkdir ".\tmp"


echo %INFO% 推送APK文件到设备...%RESET%
call adbdevice adb
adb push "!args1!" /sdcard/tmp.apk

echo %INFO% 开始调用安装器安装...%RESET%
adb shell am start -a android.intent.action.VIEW -d file:///sdcard/tmp.apk -t application/vnd.android.package-archive > ".\tmp\instapptmp.txt" 2>&1
echo %INFO% 请在设备上进行安装后
pause.exe
echo %GREEN% 安装完成！%RESET%
call adbdevice adb
adb shell rm /sdcard/tmp.apk
if exist ".\tmp\instapptmp.txt" del ".\tmp\instapptmp.txt" >nul 2>&1
endlocal
set /a SUCCESS+=1
exit /b

:error

find /i "INSTALL_FAILED_ALREADY_EXISTS" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%应用已存在，请卸载后重试%RESET%
)

find /i "INSTALL_FAILED_UPDATE_INCOMPATIBLE" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%签名不一致，请先卸载旧版本%RESET%
)

find /i "INSTALL_PARSE_FAILED_INCONSISTENT_CERTIFICATES" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%签名证书不一致，请先卸载旧版本%RESET%
)

find /i "INSTALL_FAILED_VERSION_DOWNGRADE" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%版本低于已安装应用的版本%RESET%
)

find /i "INSTALL_FAILED_UID_CHANGED" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%应用残留数据导致UID变化，请彻底卸载后重试%RESET%
)

find /i "INSTALL_FAILED_INSUFFICIENT_STORAGE" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%存储空间不足，请清理设备空间%RESET%
)

find /i "INSTALL_FAILED_MEDIA_UNAVAILABLE" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%存储介质不可用或指定安装到SD卡但设备无SD卡%RESET%
)

find /i "INSTALL_FAILED_DEXOPT" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%DEX优化失败，可能空间不足或APK损坏%RESET%
)

find /i "INSTALL_FAILED_OLDER_SDK" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%应用要求的系统版本高于当前设备%RESET%
)

find /i "INSTALL_FAILED_CPU_ABI_INCOMPATIBLE" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%CPU架构不兼容，请更换对应版本的APK%RESET%
)

find /i "INSTALL_FAILED_MISSING_SHARED_LIBRARY" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%缺少应用依赖的共享库%RESET%
)

find /i "INSTALL_FAILED_INVALID_APK" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%APK文件无效或已损坏%RESET%
)

find /i "INSTALL_PARSE_FAILED_NO_CERTIFICATES" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%APK未签名，请先签名后再安装%RESET%
)

find /i "INSTALL_FAILED_TEST_ONLY" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%APK为测试包%RESET%
)

find /i "INSTALL_FAILED_VERIFICATION_FAILURE" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%安全验证失败%RESET%
)

find /i "INSTALL_CANCELED_BY_USER" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%安装被用户取消，或未允许“未知来源”安装%RESET%
)

find /i "INSTALL_FAILED_INVALID_URI" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%APK路径包含特殊字符，请改为英文路径%RESET%
)

find /i "device not found" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Red%未找到设备，请检查USB调试及连接%RESET%
)

find /i "offline" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Red%设备离线，请重新插拔USB或重启ADB服务%RESET%
)

find /i "unauthorized" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Red%设备未授权，请在允许USB调试%RESET%
)

find /i "more than one device" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Red%检测到多个设备/模拟器，请指定设备序列号%RESET%
)

find /i "is system running" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Red%系统可能正在开机或服务没有运行，建议等待系统稳定后重试%RESET%
)

find /i "find package" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Red%包管理服务没有运行，建议等待服务稳定后重试%RESET%
)

find /i "XTC" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Red%手表厂商xtc限制了安装%RESET%
)
echo.%Red%原始报错：
type ".\tmp\instapptmp.txt" 2>nul
if exist ".\tmp\instapptmp.txt" del ".\tmp\instapptmp.txt" >nul 2>&1
set /p yesno=%ERROR% 安装失败！按任意键重试...[输入no跳过]%RESET%
if "%yesno%"=="no" endlocal&&set /a FAILED+=1&&exit /b
goto callinst

:important
call adbdevice adb
adb install -r -t -d "%args1%" > ".\tmp\instapptmp.txt" 2>&1
find /i "Success" "%cd%\tmp\instapptmp.txt" >nul
if !errorlevel! equ 0 (
    echo %GREEN% 安装成功！%RESET%
    if exist ".\tmp\instapptmp.txt" del ".\tmp\instapptmp.txt" >nul 2>&1
    endlocal
    exit /b
) else goto importanterror

:importanterror
set /a retry+=1
if !retry! lss 6 (
    echo %warn%安装失败，这一般是正常情况，30秒后重试
    busybox sleep 30
    goto important
) else goto error