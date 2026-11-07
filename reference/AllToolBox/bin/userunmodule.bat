echo %info%等待设备连接...
call adbdevice.bat adb
call adbdevice.bat root
if %errorlevel% neq 0 (
    echo %error%没有root权限,请尝试进入twrp/qmmi
    pause.exe 返回
    exit /b
)

echo %info%正在读取已安装的 Magisk 模块...
set count=0
for /f "delims=" %%a in ('adb shell %suroot% ls /data/adb/modules/ 2^>nul') do (
    set "mod=%%a"
    if not "!mod!"=="" (
        set /a count+=1
        set "module[!count!]=!mod!"
        echo   [!count!] !mod!
    )
)

if %count% equ 0 (
    echo %error%未找到任何已安装的 Magisk 模块。
    pause.exe 返回
    exit /b
)

set "menu_config=.\menu\magisk_modules_menu.json"
(
    echo {
    echo   "options": [
    for /l %%i in (1,1,%count%) do (
        set "mod_name=!module[%%i]!"

        echo     {"value": "!mod_name!", "label": "!mod_name!"}
        if %%i lss %count% echo ,
    )
    echo   ]
    echo }
) > "%menu_config%"

cls
echo %info%请选择需要卸载的模块
set SELECTED=exitexitcloseoffexitexitexitoff

menu.exe -s "%menu_config%"

set /p SELECTED=<menutmp.txt
del /Q /F "menutmp.txt" 2>nul
del /Q /F "%menu_config%" 2>nul

if "%SELECTED%"=="exitexitcloseoffexitexitexitoff" (
    echo %error%未选择任何模块。
    pause.exe 退出
    goto :end
)

if "%SELECTED%"=="" (
    echo %error%未选择任何模块。
    pause.exe 退出
    goto :end
)

echo 您选择的模块: %SELECTED%


set "modules_to_remove=%SELECTED%"


echo.
echo %WARN%即将卸载以下模块，此操作不可恢复！
echo   %modules_to_remove%
echo %info%如果不想卸载，请现在关掉这个窗口，5秒后继续...
busybox sleep 5
if exist .\magiskunmod.txt set /p magiskunmod=<magiskunmod.txt
for %%m in (%modules_to_remove%) do (
    echo 正在卸载模块: %%m
    call unmodule.bat %%m !magiskunmod!
    if errorlevel 1 (
        echo %error%卸载 %%m 失败。
    ) else (
        echo %info%模块 %%m 已卸载。
    )
)

:reboot
ECHO.
ECHO.%YELLOW%是否重启设备以配置修改?
del /Q /F .\menutmp.txt >nul 2>nul

menu.exe .\menu\yesno.json
set /p quq=<menutmp.txt
if "%quq%"=="y" (
adb reboot
ECHO.%INFO%操作完成...
pause.exe 退出
exit /b
)
if "%quq%"=="n" (
ECHO.%INFO%操作完成...
pause.exe 退出
exit /b
)
