if not exist .\tmp\xtcpatch.zip call cloud xtcpatch
echo %INFO%请确保手表端已经开启了自动响应%RESET%
device_check.exe adb&&ECHO.
for /f "delims=" %%i in ('adb shell getprop ro.product.innermodel') do set innermodel=%%i
echo %info%您的设备innermodel为:%innermodel%
for /f "delims=" %%i in ('adb shell getprop ro.build.version.release') do set androidversion=%%i
echo %info%您的设备安卓版本为:%androidversion%
if "%androidversion%"=="7.1.1" (
    call instmodule.bat tmp\xtcpatch.zip shinst
    goto XTCPatch-DONE
)
if "%androidversion%"=="4.4.4" (
    call instmodule.bat tmp\xtcpatch.zip shinst
    goto XTCPatch-DONE
)

call instmodule.bat tmp\xtcpatch.zip magisk
:XTCPatch-DONE
echo %INFO%重启手表%RESET%
adb reboot
echo %GREEN%XTCPatch安装完成%RESET%
pause.exe 返回
