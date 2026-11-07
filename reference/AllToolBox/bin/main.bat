:menu
CLS
call logo

set notice=%ERROR%没有获取到公告
if not exist .\notice.txt goto echo_notice
for /f %%a in ('findstr /n .^<notice.txt') do set /a lines+=1
if %lines% equ 0 goto echo_notice
set /a rand=%random% %% lines + 1
for /f "delims=" %%a in ('findstr /n .^<notice.txt ^| findstr "^%rand%:"') do (
    set "line=%%a"
    set "line=!line:*:=!"
)
set notice=!line!
:echo_notice
call call call ECHO !notice!

if "%speedstart-upall%"=="up" ECHO.%GREEN%检查到有新版本，请关闭快速启动后更新
if exist .\settings\test.txt ECHO.%red%你正在使用测试版本！%RESET%
ECHO.%ORANGE%XTC AllToolBox %atbversion% 主菜单%BLUE% by xgj_236%RESET%
if defined ATB_running_mod if not "%ATB_running_mod%"=="0" echo %BLUE%已加载 %ATB_running_mod% 个模块
ECHO.%yellow%上下键或鼠标选择，双击或回车确定%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\main.json
set /p MENU=<menutmp.txt
if "%MENU%"=="s" call search & goto menu
if "%MENU%"=="1" CLS & call root & goto menu
if "%MENU%"=="2" CLS & cmd /k & goto menu
if "%MENU%"=="3" goto about
if "%MENU%"=="4" goto commonly
if "%MENU%"=="5" CLS & call rebootpro & goto menu
if "%MENU%"=="6" CLS & call cloud & goto menu
if "%MENU%"=="7" goto appset
if "%MENU%"=="8" goto magisk
if "%MENU%"=="9" goto scripttool
if "%MENU%"=="10" goto settings
if "%MENU%"=="11" CLS & call rtos_main & goto menu
if /i "%MENU%"=="DEBUG" goto debug
ECHO %ERROR%输入错误，请重新输入！%RESET%
timeout /t 2 >nul
goto menu

:about
CLS
ECHO.%YELLOW%=--------------------------------------------------------------------=%RESET%
ECHO.%INFO%本脚本由快乐小公爵236等开发者制作%RESET%
call thank
pause.exe 继续
ECHO %INFO%工具官网：https://atb.xgj.qzz.io%RESET%
ECHO.%INFO%作者QQ：3247039462%RESET%
ECHO.%INFO%工具箱交流与反馈QQ群：907491503%RESET%
ECHO.%INFO%作者哔哩哔哩账号：https://b23.tv/L54R5ZV%RESET%
ECHO.%INFO%bug与建议反馈邮箱：ATBbug@xgj.qzz.io%RESET%
pause.exe 继续
call uplog
ECHO.%YELLOW%=--------------------------------------------------------------------=%RESET%
pause.exe 返回
goto menu

:appset
CLS
call logo
ECHO %ORANGE%应用管理菜单%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\appset.json
set /p MENU=<menutmp.txt
if /i "%MENU%"=="A" goto menu
if "%MENU%"=="1" CLS & call userinstapp & goto appset
if "%MENU%"=="2" CLS & call unapp & goto appset
if "%MENU%"=="3" CLS & call qqwxautestart & goto appset
:: if "%MENU%"=="4" CLS & call z10openinst & goto appset
ECHO %ERROR%输入错误，请重新输入！%RESET%
timeout /t 2 >nul
goto appset

:commonly
CLS
call logo
ECHO %ORANGE%常用合集%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\commonly.json
set /p MENU=<menutmp.txt
if /i "%MENU%"=="A" goto menu
if "%MENU%"=="1" CLS & call ota & goto commonly
if "%MENU%"=="2" CLS & call pashtwrp & goto commonly
if "%MENU%"=="3" CLS & call backup & goto commonly
if "%MENU%"=="4" CLS & call rootpro & goto commonly
if "%MENU%"=="5" CLS & call scrcpy-ui.bat & goto commonly
if "%MENU%"=="6" CLS & call opencharge & goto commonly
if "%MENU%"=="7" CLS & call super_recovery & goto commonly
if "%MENU%"=="8" CLS & call Xposed & goto commonly
if "%MENU%"=="9" CLS & call wifiadb & goto commonly
ECHO %ERROR%输入错误，请重新输入！%RESET%
timeout /t 2 >nul
goto commonly

:magisk
CLS
call logo
ECHO %ORANGE%magisk模块管理%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\magisk.json
set /p MENU=<menutmp.txt
if /i "%MENU%"=="A" goto menu
if "%MENU%"=="1" CLS & call userinstmodule 1 & goto magisk
if "%MENU%"=="2" CLS & call userinstmodule 2 & goto magisk
if "%MENU%"=="3" CLS & call userinstmodule 3 & goto magisk
if "%MENU%"=="4" CLS & call magisklist & goto magisk
if "%MENU%"=="5" CLS & call userunmodule & goto magisk
if "%MENU%"=="6" CLS & call setmagisk install & goto magisk
if "%MENU%"=="7" CLS & call setmagisk un & goto magisk
if "%MENU%"=="8" CLS & call xtcpatch & goto magisk
if "%MENU%"=="9" CLS & call modulestore & goto magisk
ECHO %ERROR%输入错误，请重新输入！%RESET%
timeout /t 2 >nul
goto magisk

:scripttool
CLS
call logo
ECHO %ORANGE%高级工具%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\scripttool.json
set /p MENU=<menutmp.txt
if /i "%MENU%"=="A" goto menu
if "%MENU%"=="1" CLS & call innermodel & pause.exe 返回 & goto scripttool
if "%MENU%"=="2" CLS & call pashroot & goto scripttool
if "%MENU%"=="3" CLS & call root nouserdata & goto scripttool
if "%MENU%"=="4" CLS & call pashtwrppro & goto scripttool
if "%MENU%"=="5" CLS & call listbuild & goto scripttool
if "%MENU%"=="6" CLS & call root rootedl & goto scripttool
if "%MENU%"=="7" CLS & call root allmod & goto scripttool
ECHO %ERROR%输入错误，请重新输入！%RESET%
timeout /t 2 >nul
goto scripttool

::--------------------------settings--------------------------

:settings
CLS
call logo
ECHO %ORANGE%工具箱设置%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\settings.json
set /p MENU=<menutmp.txt
if /i "%MENU%"=="A" goto menu
if "%MENU%"=="1" goto speedstart
if "%MENU%"=="2" goto Script-Information
if "%MENU%"=="3" ground_glass slider & goto settings
if "%MENU%"=="4" call checkdriver.bat fixdriver & pause.exe 返回 & goto settings
if "%MENU%"=="5" goto update_now & pause.exe 返回 & goto settings
ECHO %ERROR%输入错误，请重新输入！%RESET%
timeout /t 2 >nul
goto settings

:speedstart
set /p speedstart=<settings\speedstart.txt
if "!speedstart!"=="true" (
    set /p="false" <nul > settings\speedstart.txt
    ECHO.%INFO%已关闭快速启动
    timeout /t 2 >nul
    goto settings
)
ECHO.%YELLOW%确定要开启快速启动吗？
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\yesno.json
set /p yesno=<menutmp.txt
if /i "%yesno%"=="n" goto settings
set /p="true" <nul > settings\speedstart.txt
ECHO.%INFO%已开启快速启动
timeout /t 2 >nul
goto settings

:Script-Information
cls
set "versioncode="
set "versionuser="
set "resversion="

if exist "%~dp0settings\versioncode.txt" (
    set /p versioncode=<"%~dp0settings\versioncode.txt"
)

if exist "%~dp0settings\versionuser.txt" (
    set /p versionuser=<"%~dp0settings\versionuser.txt"
)

echo %INFO%版本代码:%versioncode%
echo %INFO%脚本版本:%versionuser%
echo %INFO%资源版本:
type "%~dp0settings\resversion.txt"
echo.
pause.exe 返回
goto settings

:update_now
ECHO.%YELLOW%确定要强制更新吗？
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\yesno.json
set /p yesno=<menutmp.txt
if /i "%yesno%"=="n" goto settings
set /p="start" <nul >.\settings\startup.txt
TIMEOUT /T -1 /NOBREAK >nul
goto settings

::--------------------------debug--------------------------

:debug
CLS
call logo
ECHO %RED%DEBUG菜单%YELLOW%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\debug.json
set /p MENU=<menutmp.txt
if /i "%MENU%"=="A" goto menu
if "%MENU%"=="1" goto color
if "%MENU%"=="2" set /p="1" <nul > whoyou.txt & goto debug
if "%MENU%"=="3" set /p="2" <nul > whoyou.txt & goto debug
if "%MENU%"=="4" set /p="3" <nul > whoyou.txt & goto debug
if "%MENU%"=="5" goto sel
ECHO %ERROR%输入错误，请重新输入！%RESET%
timeout /t 2 >nul
goto debug

:sel
CLS
call sel file s .
call :sel-info
pause.exe 继续
call sel file m .
call :sel-info
pause.exe 继续
call sel folder s .
call :sel-info
pause.exe 继续
call sel folder m .
call :sel-info
pause.exe 返回
goto debug

:sel-info
echo %INFO%%sel__file_path% - 文件的完整路径
echo %INFO%%sel__file_fullname% - 文件名（包含扩展名）
echo %INFO%%sel__file_name% - 文件名（不包含扩展名）
echo %INFO%%sel__file_ext% - 文件扩展名（不包含点号）
echo %INFO%%sel__file_folder% - 文件所在目录路径
echo %INFO%%sel__folder_path% - 文件夹的完整路径
echo %INFO%%sel__folder_name% - 文件夹名称
echo %INFO%%sel__folders% - 多个文件夹的路径
echo %INFO%%sel__files% - 多个文件的路径
if exist .\settings\sel_last_path.txt set /p sel_last_path=<.\settings\sel_last_path.txt >nul
set sel_startfolder=..
if exist .\settings\sel_last_path.txt if exist "%sel_last_path%\" set /p sel_startfolder=<.\settings\sel_last_path.txt >nul
echo %INFO%%sel_startfolder% - 默认起始路径
set "sel_startfolder="
set "sel__file_path="
set "sel__file_fullname="
set "sel__file_name="
set "sel__file_ext="
set "sel__file_folder="
set "sel__folder_path="
set "sel__folder_name="
set "sel__folders="
set "sel__files="
exit /b

:color
CLS
ECHO %BLACK%BLACKadb工具大全AllToolBox%RESET%
ECHO %RED_2%RED_2adb工具大全AllToolBox%RESET%
ECHO %GREEN_2%GREEN_2adb工具大全AllToolBox%RESET%
ECHO %ORANGE%ORANGEadb工具大全AllToolBox%RESET%
ECHO %BLUE_2%BLUE_2adb工具大全AllToolBox%RESET%
ECHO %MAGENTA%MAGENTAadb工具大全AllToolBox%RESET%
ECHO %CYAN_2%CYAN_2adb工具大全AllToolBox%RESET%
ECHO %WHITE_2%WHITE_2adb工具大全AllToolBox%RESET%
ECHO %GRAY%GRAYadb工具大全AllToolBox%RESET%
ECHO %RED%REDadb工具大全AllToolBox%RESET%
ECHO %GREEN%GREENadb工具大全AllToolBox%RESET%
ECHO %YELLOW%YELLOWadb工具大全AllToolBox%RESET%
ECHO %BLUE%BLUEadb工具大全AllToolBox%RESET%
ECHO %PINK%PINKadb工具大全AllToolBox%RESET%
ECHO %CYAN%CYANadb工具大全AllToolBox%RESET%
ECHO %WHITE%WHITEadb工具大全AllToolBox%RESET%
ECHO %ORANGEPRO%ORANGEPROadb工具大全AllToolBox%RESET%
ECHO %ERROR%ERRORadb工具大全AllToolBox%RESET%
ECHO %INFO%INFOadb工具大全AllToolBox%RESET%
ECHO %WARN%WARNadb工具大全AllToolBox%RESET%
ECHO %RESET%RESETadb工具大全AllToolBox%RESET%
pause.exe 返回
goto debug
