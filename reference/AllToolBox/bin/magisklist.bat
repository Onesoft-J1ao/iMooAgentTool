

echo %info%等待设备连接...%RESET%
call adbdevice adb
echo %info%正在检查 root 权限...%RESET%
call adbdevice root
if "%errorlevel%"=="1" (
    ECHO.%error%没有root权限!
    pause.exe 返回
    exit /b
)
run_cmd "adb push magisklistmod.sh /data/local/tmp/magisklistmod.sh"

chcp 65001 2>nul 1>nul

adb shell %suroot% sh /data/local/tmp/magisklistmod.sh

pause.exe EXIT
chcp 936 2>nul 1>nul
exit /b