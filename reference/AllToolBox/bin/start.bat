@echo off
setlocal enabledelayedexpansion
chcp 936 2>nul 1>nul
cd /d "%~dp0" 2>nul 1>nul
cd /d bin 2>nul 1>nul
set /p atbversion=<settings\versionuser.txt
title XTC AllToolBox %atbversion% by xgj_236
set /p speedstart=<settings\speedstart.txt
call color
if not "!speedstart!"=="true" ECHO %INFO%正在启动程序...
call checkfile.bat

if "!speedstart!"=="true" (
    call speedstart
    goto menu
)


ECHO %INFO%检查系统环境变量...
set PATH=%cd%;%PATH%;C:\Windows\system32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0;C:\Windows\System32\OpenSSH
set PATHEXT=%PATHEXT%;.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC
set /p="%cd%" <nul | find " " 1>nul 2>nul && ECHO %ERROR%当前工具所在路径含有空格，请尝试将工具移动到其他位置%RESET%&& pause.exe&&exit /b
set workcd=%cd%
set /p whoyou=<whoyou.txt
if not "%whoyou%"=="2" (
    call uplog
)
call checkdriver
:: set /p check_up_time=<settings\check_up_time.txt
:: set /a check_up_time=%check_up_time%*3600 1>nul 2>nul
:: copy /y .\timer-tmp-up.txt .\timer-tmp-up-copy.txt 1>nul 2>nul
:: for /f "tokens=1-3 delims=:" %%a in ('timer end up') do set /a "sec=%%a*3600+%%b*60+%%c" 1>nul 2>nul
:: move /y .\timer-tmp-up-copy.txt .\timer-tmp-up.txt 1>nul 2>nul
:: if defined sec if !sec! lss !check_up_time! goto skipcheck_up
:: ECHO %INFO%正在检查更新...%RESET%
:: call upall run
:: call check_res
:: ECHO %INFO%正在拉取公告...%RESET%
:: del /Q /F .\notice.txt >nul 2>nul
:: call link notice url
:: call curltool.bat !url! 2>nul >nul
:: if !errorlevel! neq 0 (
    :: echo %ERROR%获取公告时出错，错误值:!errorlevel!
:: )
:: timer start up
:: :skipcheck_up
ECHO %INFO%正在检查ADB命令...%RESET%
adb version 1>nul 2>nul
if %errorlevel% neq 0 (
    ECHO %ERROR%ADB检查失败%RESET%
    timeout /t 2 /nobreak >nul
    exit
)
ECHO %INFO%检查ADB命令成功%RESET%
set /p="2" <nul > whoyou.txt
ECHO %INFO%检查是否有可用alltoolbox模块%RESET%
call Loadatbmod
ECHO.%YELLOW%=--------------------------------------------------------------------=%RESET%
ECHO %WARN%关于解绑：该工具不提供手表强制解绑服务，如您拾取他人的手表，请联系当地110公安机关归还失主。手表解绑属于非法行为，请归还失主。而不要尝试通过任何手段解除挂失锁%RESET%
ECHO %WARN%关于收费：这个工具是完全免费的，!严禁倒卖本工具!，如果你付费购买了那么请退款%RESET%
ECHO %WARN%本脚本部分功能可能造成侵权问题，并可能受到法律追究，所以仅供个人使用，请勿用于商业用途%RESET%
ECHO %INFO%---请永远相信我们能给你带来免费又好用的工具---%RESET%
ECHO %INFO%关于官网：https://atb.xgj.qzz.io%RESET%
ECHO %INFO%关于作者：本脚本由快乐小公爵236等作者制作%RESET%
ECHO.%INFO%作者QQ：3247039462%RESET%
ECHO.%INFO%工具箱交流与反馈QQ群：907491503%RESET%
ECHO.%INFO%作者哔哩哔哩账号：https://b23.tv/L54R5ZV%RESET%
ECHO.%INFO%bug与建议反馈邮箱：ATBbug@xgj.qzz.io%RESET%
ECHO.%YELLOW%=--------------------------------------------------------------------=%RESET%
pause.exe 进入主界面
:menu
call main.bat