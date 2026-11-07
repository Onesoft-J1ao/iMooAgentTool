if "%1"=="un" goto un
if "%1"=="install" goto install




:un
call logo.bat
ECHO %ORANGE%设置卸载模块的方式%YELLOW%
menu.exe .\menu\setmagisk-un.json
set /p MENU=<menutmp.txt
if "%MENU%"=="A" exit /b
if "%MENU%"=="1" set /p="script" <nul > magiskunmod.txt
if "%MENU%"=="2" set /p="direct" <nul > magiskunmod.txt
if "%MENU%"=="3" set /p="mark" <nul > magiskunmod.txt
echo %GREEN%修改卸载方式成功%RESET%
timeout /t 2 >nul
goto un




:install
call logo.bat
ECHO %ORANGE%设置安装模块的方式%YELLOW%
menu.exe .\menu\setmagisk-in.json
set /p MENU=<menutmp.txt
if "%MENU%"=="A" exit /b
if "%MENU%"=="1" set /p="magisk" <nul > magiskinstmod.txt
if "%MENU%"=="2" set /p="shinst" <nul > magiskinstmod.txt
if "%MENU%"=="3" set /p="peremptory" <nul > magiskinstmod.txt
echo %GREEN%修改安装方式成功%RESET%
timeout /t 2 >nul
goto install