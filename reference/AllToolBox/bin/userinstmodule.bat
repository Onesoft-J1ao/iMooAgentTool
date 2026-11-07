
if "%1"=="1" goto INSTALL_SINGLE_SEL
if "%1"=="2" goto INSTALL_MULTI_SEL
if "%1"=="3" goto INSTALL_FOLDER_SEL

:INSTALL_SINGLE_SEL
setlocal enabledelayedexpansion
echo.
echo %INFO% 正在打开文件选择对话框...%RESET%
call sel file s . [zip]

echo.
echo %INFO%即将刷入：%sel__file_fullname%%RESET%
ECHO.请接入ADB设备...
device_check.exe adb&&ECHO.
ECHO.

for /f "delims=" %%i in ('adb shell getprop ro.product.innermodel') do set innermodel=%%i
ECHO.%INFO%您的设备innermodel为:%innermodel%
for /f "delims=" %%i in ('adb shell getprop ro.build.version.release') do set androidversion=%%i
ECHO.%INFO%您的设备安卓版本为:%androidversion%
echo %INFO% 正在刷入模块...%RESET%
if exist .\instmod.txt set /p instmod=<magiskinstmod.txt
call instmodule.bat %sel__file_path% !instmod!

if !errorlevel! equ 0 (
    echo %GREEN%刷入成功！%RESET%
    call :reboot
) else (
    echo %RED%刷入失败！%RESET%
)

pause.exe 返回菜单
endlocal
goto MAIN_MENU

:INSTALL_MULTI_SEL
setlocal enabledelayedexpansion
echo.
echo %INFO% 正在打开文件选择对话框(多选)...%RESET%
call sel file m . [zip]

echo.
echo %INFO% 选择的文件列表：%RESET%
set COUNT=0
for %%f in (%sel__files:/= %) do (
    set /a COUNT+=1
    echo %CYAN%!COUNT!.%RESET% %WHITE%%%f%RESET%
    if defined FILE_LIST (
        set "FILE_LIST=!FILE_LIST! "%%f""
    ) else (
        set "FILE_LIST="%%f""
    )
)
ECHO.请接入ADB设备...
device_check.exe adb&&ECHO.
echo.
for /f "delims=" %%i in ('adb shell getprop ro.product.innermodel') do set innermodel=%%i
ECHO.%INFO%您的设备innermodel为:%innermodel%
for /f "delims=" %%i in ('adb shell getprop ro.build.version.release') do set androidversion=%%i
ECHO.%INFO%您的设备安卓版本为:%androidversion%
echo %INFO% 开始批量刷入...%RESET%

set SUCCESS=0
set FAIL=0

for %%i in (%sel__files:/= %) do (
    echo.
    echo %CYAN%正在刷入: %%~nxi%RESET%
    if exist .\instmod.txt set /p instmod=<magiskinstmod.txt
    call instmodule.bat %%i !instmod!
    if !errorlevel! equ 0 (
        echo %GREEN%刷入成功！%RESET%
        set /a SUCCESS+=1
    ) else (
        echo %RED%刷入失败！%RESET%
        set /a FAIL+=1
    )
)

echo.
echo %GREEN%批量刷入完成！%RESET%
echo %CYAN%总计：%RESET%%WHITE%!COUNT!%RESET% %CYAN%个模块%RESET%
echo %GREEN%成功：!SUCCESS!%RESET%
echo %RED%失败：!FAIL!%RESET%
call :reboot

pause.exe 返回菜单
endlocal
goto MAIN_MENU

:INSTALL_FOLDER_SEL
setlocal enabledelayedexpansion
echo.
echo %INFO% 正在打开文件夹选择对话框...%RESET%
call sel folder s .

echo %INFO% 选择的文件夹：%RESET%%PINK%%sel__folder_path%%RESET%

echo.
echo %INFO% 扫描zip文件...%RESET%
set COUNT=0
for %%i in ("%sel__folder_path%\*.zip") do (
    set /a COUNT+=1
    set "FILE_!COUNT!=%%i"
    echo %CYAN%!COUNT!.%RESET% %WHITE%%%i%RESET%
)

if !COUNT! equ 0 (
    echo %ERROR% 在指定文件夹中未找到zip文件%RESET%
    pause.exe
    goto MAIN_MENU
)
ECHO.请接入ADB设备...
device_check.exe adb&&ECHO.
echo.
for /f "delims=" %%i in ('adb shell getprop ro.product.innermodel') do set innermodel=%%i
ECHO.%INFO%您的设备innermodel为:%innermodel%
for /f "delims=" %%i in ('adb shell getprop ro.build.version.release') do set androidversion=%%i
ECHO.%INFO%您的设备安卓版本为:%androidversion%
echo %INFO% 开始批量刷入...%RESET%

set SUCCESS=0
set FAIL=0

for /l %%n in (1,1,!COUNT!) do (
    set "file=!FILE_%%n!"
    for %%A in ("!file!") do (
        set "filename=%%~nxA"
    )
    echo.
    echo %CYAN%正在刷入: !filename!%RESET%
    if exist .\instmod.txt set /p instmod=<magiskinstmod.txt
    call instmodule.bat !file! !instmod!
    if !errorlevel! equ 0 (
        echo %GREEN%刷入成功！%RESET%
        set /a SUCCESS+=1
    ) else (
        echo %RED%刷入失败！%RESET%
        set /a FAIL+=1
    )
)

echo.
echo %GREEN%批量刷入完成！%RESET%
echo %CYAN%总计：%RESET%%WHITE%!COUNT!%RESET% %CYAN%个模块%RESET%
echo   %GREEN%成功：!SUCCESS!%RESET%
echo   %RED%失败：!FAIL!%RESET%
call :reboot

pause.exe 返回菜单
endlocal
goto MAIN_MENU

:reboot
ECHO.
ECHO.%YELLOW%是否重启设备以加载模块?
del /Q /F .\menutmp.txt >nul 2>nul

menu.exe .\menu\yesno.json
set /p quq=<menutmp.txt
if "%quq%"=="y" (
adb reboot
ECHO.%INFO%操作完成...
exit /b
)
if "%quq%"=="n" (
ECHO.%INFO%操作完成...
exit /b
)
