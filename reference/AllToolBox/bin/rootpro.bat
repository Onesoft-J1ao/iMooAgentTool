if not exist .\rootproapks call cloud rootproapks
device_check.exe adb&&ECHO.
call boot_completed.bat
ECHO.%INFO%开始执行优化...
for /f "delims=" %%i in ('adb shell getprop ro.product.innermodel') do set innermodel=%%i
echo %INFO%您的设备innermodel为:%innermodel%
for /f "delims=" %%i in ('adb shell getprop ro.product.model') do set model=%%i
echo %INFO%手表型号:%model%
for /f "delims=" %%i in ('adb shell getprop ro.build.version.release') do set androidversion=%%i
echo %INFO%安卓版本:%androidversion%
for /f "delims=" %%i in ('adb shell getprop ro.build.version.sdk') do set sdkversion=%%i
echo %INFO%SDK版本号:%sdkversion%
for /f "delims=" %%i in ('adb shell getprop ro.product.current.softversion') do set version=%%i
echo %INFO%版本号:%version%
if not "%sdkversion%"=="27" (
echo %error%你的安卓版本不是8.1，该功能不支持你的手表
pause.exe
exit /b
)
set rootproapks=n
set rootpromagisk=n
device_check.exe adb&&ECHO.
call boot_completed.bat
ECHO.%INFO%你是否要安装拓展应用包？
set /p rootproapks=%YELLOW%输入y进行刷入，按任意键跳过:%RESET%
if not "%rootproapks%"=="y" goto noinstapk
ECHO.%INFO%开始安装应用

if not exist ".\rootproapks\rootproapks.txt" echo %error%找不到 rootproapks.txt 无法完成安装

for /f "usebackq delims=" %%i in (".\rootproapks\rootproapks.txt") do (
    if not "%%i"=="" (
        call instapp.bat ".\rootproapks\%%i"
    )
)

ECHO.%INFO%安装完成
:noinstapk


ECHO.%INFO%你是否要刷入拓展magisk模块？
set /p rootpromagisk=%YELLOW%输入y进行刷入，按任意键跳过:%RESET%
if not "%rootpromagisk%"=="y" goto noinstmod

ECHO.%INFO%开始安装模块

if not exist ".\magiskmod\rootpromods.txt" echo %error%找不到 rootpromods.txt 无法完成安装

for /f "usebackq delims=" %%i in (".\magiskmod\rootpromods.txt") do (
    if not "%%i"=="" (
        call adbdevice.bat root
        if %errorlevel% neq 0 (
            echo %error%没有root权限
            pause.exe 返回
            exit /b
        )
        call instmodule.bat ".\magiskmod\%%i"
    )
)

ECHO.%INFO%模块安装完成


:noinstmod
ECHO.%INFO%优化全部完成

pause.exe 返回
exit /b