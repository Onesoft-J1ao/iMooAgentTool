

set args1=%~1
set args2=%~2
set args3=%~3

if "%args2%"=="magisk" goto magisk
if "%args2%"=="shinst" goto shinst
if "%args2%"=="peremptory" goto peremptory

:magisk
call adbdevice adb >nul 2>&1
adb push %args1% /sdcard/temp_module.zip >nul 2>&1
if %errorlevel% neq 0 goto error
adb shell "su -c 'magisk --install-module /sdcard/temp_module.zip'; exit $?"
if %errorlevel% neq 0 goto error
adb shell rm /sdcard/temp_module.zip >nul 2>&1
exit /b 0

:shinst
call adbdevice adb >nul 2>&1
adb push %args1% /sdcard/temp_module.zip >nul 2>&1
if %errorlevel% neq 0 goto error
adb push sh_module_installer.sh /sdcard/sh_module_installer.sh >nul 2>&1
if %errorlevel% neq 0 goto error
adb shell "su -c 'sh /sdcard/sh_module_installer.sh'; exit $?"
if %errorlevel% neq 0 goto error
adb shell rm /sdcard/temp_module.zip /sdcard/temp_module_installer.sh >nul 2>&1
exit /b 0

:peremptory
call adbdevice adb >nul 2>&1
adb push magiskperinster.sh /sdcard/magiskperinster.sh >nul 2>&1
if %errorlevel% neq 0 goto error
adb push %args1% /sdcard/temp_module.zip >nul 2>&1
if %errorlevel% neq 0 goto error
adb shell "su -c 'sh /sdcard/magiskperinster.sh'; exit $?"
if %errorlevel% neq 0 goto error
adb shell rm /sdcard/temp_module.zip /sdcard/magiskperinster.sh >nul 2>&1
exit /b 0

:error
adb shell rm /sdcard/temp_module.zip >nul 2>&1
adb shell rm /sdcard/temp_module_installer.sh >nul 2>&1
adb shell rm /sdcard/magiskperinster.sh >nul 2>&1
exit /b 1