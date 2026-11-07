ECHO %INFO%下载固件包或超级恢复请访问https://pan.xgj.qzz.io/@s/scbulUyl%RESET%
pause.exe
echo %info%请解压固件包，然后选择您解压到的目录，或者选择超级恢复目录下的data文件夹
pause.exe
call sel folder s .
if /i not "%sel__folder_name%"=="data" (
    echo %WARN%选择的文件夹名称不是data，请确认是固件包
    pause.exe 继续并忽略
)

dir /b "%sel__folder_path%\*.img" 2>nul >nul
if not %errorlevel% equ 0 (
    echo %error%选择的目录中没有*.img文件
    pause.exe 返回
    exit /b
)

dir /b "%sel__folder_path%\*.xml" 2>nul >nul
if not %errorlevel% equ 0 (
    echo %error%选择的目录中没有*.xml文件
    pause.exe 返回
    exit /b
)

set "QSaharaServer="

if exist "%sel__folder_path%\prog_firehose_ddr.elf" (
    set QSaharaServer=prog_firehose_ddr.elf
)

dir /b "%sel__folder_path%\*8937*" 2>nul >nul
if %errorlevel% equ 0 (
    set QSaharaServer=msm8937.mbn
)

dir /b "%sel__folder_path%\*8909*" 2>nul >nul
if %errorlevel% equ 0 (
    set QSaharaServer=msm8909w.mbn
)

if "%QSaharaServer%" == "" (
    echo %error%选择的目录没有引导文件
    pause.exe 返回
    exit /b
)

if exist "%sel__folder_path%\rawprogram0.xml" goto start
if exist "%sel__folder_path%\rawprogram1.xml" goto start
if exist "%sel__folder_path%\rawprogram2.xml" goto start
echo %error%选择的目录没有可刷录入的xml
pause.exe 返回
exit /b

:start
ECHO.%INFO%准备开始...
device_check.exe qcom_edl&&ECHO.

ECHO.%INFO%获取端口并发送引导
call edlport
call QSaharaServer.bat -p \\.\COM%chkdev__edl_port% -s 13:%cd%\EDL\%QSaharaServer%
busybox sleep 2
if not exist "%sel__folder_path%\rawprogram0.xml" goto skip0
echo.%info%正在刷入rawprogram0
progress.exe P_fh_loader.bat --showpercentagecomplete --port=\\.\COM%chkdev__edl_port% --memoryname=EMMC --search_path=%sel__folder_path%\ --sendxml=%sel__folder_path%\rawprogram0.xml --noprompt
if exist "%cd%\fh_error.txt" (
    echo %error%超级恢复失败!刷入rawprogram0时出错!
    pause.exe 返回
    exit /b
)
echo.%SUCCESS%刷入rawprogram0成功
:skip0
if not exist "%sel__folder_path%\rawprogram1.xml" goto skip1
echo.%info%正在刷入rawprogram1
progress.exe P_fh_loader.bat --showpercentagecomplete --port=\\.\COM%chkdev__edl_port% --memoryname=EMMC --search_path=%sel__folder_path%\ --sendxml=%sel__folder_path%\rawprogram1.xml --noprompt
if exist "%cd%\fh_error.txt" (
    echo %error%超级恢复失败!刷入rawprogram1时出错!
    pause.exe 返回
    exit /b
)
echo.%SUCCESS%刷入rawprogram1成功
:skip1
if not exist "%sel__folder_path%\rawprogram2.xml" goto skip2
echo.%info%正在刷入rawprogram2
progress.exe P_fh_loader.bat --showpercentagecomplete --port=\\.\COM%chkdev__edl_port% --memoryname=EMMC --search_path=%sel__folder_path%\ --sendxml=%sel__folder_path%\rawprogram2.xml --noprompt
if exist "%cd%\fh_error.txt" (
    echo %error%超级恢复失败!刷入rawprogram2时出错!
    pause.exe 返回
    exit /b
)
echo.%SUCCESS%刷入rawprogram2成功
:skip2
if not exist "%sel__folder_path%\patch0.xml" goto skippatch
echo.%info%正在刷入patch0
call fh_loader.bat --port=\\.\COM%chkdev__edl_port% --memoryname=EMMC --search_path=%sel__folder_path%\ --sendxml=%sel__folder_path%\patch0.xml --noprompt
if exist "%cd%\fh_error.txt" (
    echo %error%超级恢复失败!刷入patch0时出错!
    pause.exe 返回
    exit /b
)
echo.%SUCCESS%刷入patch0成功
:skippatch
ECHO.%Yellow%是否需要重启？
del /Q /F .\menutmp.txt >nul 2>nul

menu.exe .\menu\yesno.json
set /p reboot=<menutmp.txt
if /i "%reboot%"=="y" (
ECHO.%INFO%重启手表
call qfh_loader.bat --port=\\.\COM%chkdev__edl__port% --memoryname=EMMC --search_path=EDL\ --sendxml=reboot.xml --noprompt
)
echo.%SUCCESS%超级恢复完成!
pause.exe 返回
goto :eof
