CLS
ECHO %INFO%需要未ROOT且已进入QMMI才能ota%RESET%
:ota_mode
ECHO %INFO%请选择如何开始ota？[自动下载时Z10会选择未熔断版本]
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\ota_mode.json
set /p MENU=<menutmp.txt
if "%MENU%"=="A" exit /b
if "%MENU%"=="1" goto get_ota
if "%MENU%"=="2" goto run
if "%MENU%"=="3" call qmmi & goto get_ota
if "%MENU%"=="4" call qmmi & goto run

:run
ECHO %INFO%请选择OTA包...%RESET%& call sel file s . [zip]
device_check.exe adb&&ECHO.
for /f "delims=" %%i in ('adb shell getprop ro.product.innermodel') do set innermodel=%%i
echo %INFO%您的设备innermodel为:%innermodel%
for /f "delims=" %%i in ('adb shell getprop ro.product.model') do set model=%%i
echo %INFO%手表型号:%model%
for /f "delims=" %%i in ('adb shell getprop ro.product.current.softversion') do set version=%%i
echo %INFO%版本号:%version%
goto main_start

:get_ota
device_check.exe adb&&ECHO.
for /f "delims=" %%i in ('adb shell getprop ro.product.innermodel') do set innermodel=%%i
echo %INFO%您的设备innermodel为:%innermodel%
for /f "delims=" %%i in ('adb shell getprop ro.product.model') do set model=%%i
echo %INFO%手表型号:%model%
for /f "delims=" %%i in ('adb shell getprop ro.product.current.softversion') do set version=%%i
echo %INFO%版本号:%version%
if not exist .\OTA\%innermodel%.zip call cloud ota
goto main_start

:main_start
if "%innermodel%"=="ND03" goto vabota
if "%innermodel%"=="ND08" goto vabota
if "%innermodel%"=="ND10" goto vabota
if "%innermodel%"=="ND11" goto vabota
if "%innermodel%"=="ND12" goto vabota
:ota
call isv3
if "%isv3%"=="1" (
echo %ERROR%你的手表可能是V3版本
echo %ERROR%无需离线OTA，也无法离线OTA
pause.exe
exit /b
)
adb root
call adbdevice.bat root
if %errorlevel% neq 0 (
    echo %error%没有root权限,请进入qmmi
    pause.exe 返回
    exit /b
)
adb shell "rm -rf /data/ota_package/update.zip"
adb shell "rm -rf /sdcard/xtc/ota_f_vota.zip"
adb shell "rm -rf /data/ota*"
adb push %sel__file_path% /sdcard/xtc/ota_f_vota.zip
adb shell am start -n com.xtc.setting/.module.secretcode.view.activity.OfflineOtaActivity
adb shell input tap 150 100
busybox sleep 0.5
adb shell input tap 150 310
echo %INFO%已开始升级！%RESET%
pause.exe 返回
exit /b

:vabota
adb root
call adbdevice.bat root
if %errorlevel% neq 0 (
    echo %error%没有root权限,请进入qmmi
    pause.exe 返回
    exit /b
)

adb shell am start -n com.xtc.selftest/.storage.VAbOtaTestActivity
adb push %sel__file_path% /data/ota_package/update.zip
busybox sleep 5
adb shell input tap 200 230
echo %INFO%已开始升级！%RESET%
pause.exe 返回
exit /b

:qmmi
call logo
echo %ORANGE%请选择需要ota的型号%YELLOW%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\ota.json
set /p MENU=<menutmp.txt
if "%MENU%"=="A" goto ota_mode
if "%MENU%"=="7" call rebootpro qmmi v3pash I20
if "%MENU%"=="8" call rebootpro qmmi v3pash I25
if "%MENU%"=="9" call rebootpro qmmi v3pash I25C
if "%MENU%"=="10" call rebootpro qmmi v3pash I25D
if "%MENU%"=="11" call rebootpro qmmi v3pash I32
if "%MENU%"=="12" call rebootpro qmmi v3pash ND07
if "%MENU%"=="13" call rebootpro qmmi v3pash ND01
if "%MENU%"=="14" call rebootpro qmmi z10 ND03
ECHO %ERROR%输入错误，请重新输入！%RESET%
timeout /t 2 >nul
goto qmmi