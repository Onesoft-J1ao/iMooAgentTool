
:main
CLS
call logo
ECHO %ORANGE%RTOS专区%BLUE% by 小猪%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\rtos.json
set /p MENU=<menutmp.txt
if "%MENU%"=="A" exit /b
if "%MENU%"=="1" goto :usb_2_umsc
if "%MENU%"=="2" goto :install_app
if "%MENU%"=="3" goto :uninstall_app
if "%MENU%"=="4" goto :list_apps
if "%MENU%"=="5" goto :export_app
if "%MENU%"=="6" goto :at_tool
if "%MENU%"=="7" goto :photo_viewer
if "%MENU%"=="8" goto :call_records
if "%MENU%"=="9" goto :personal_center
if "%MENU%"=="10" goto :rpk_store
if "%MENU%"=="11" goto :app_store_switch
ECHO %ERROR%输入错误，请重新输入！%RESET%
timeout /t 2 >nul
goto main



:usb_2_umsc
cls
ECHO %ORANGE%开始打开 USB2U盘
call rtosdevice detect_com
echo %info%正在发送 AT+LEAFAC=0 到 !com_port!...
rtos usb "!com_port!"
pause.exe 返回
goto :main

:install_app
cls
ECHO %ORANGE%开始安装应用
ECHO %INFO%请选择RPK软件包...%RESET%& call sel file s . [zip][rpk]
call rtosdevice
rtos install "%sel__file_path%" "%drive%"
if errorlevel 1 (
    echo %error%安装失败！
) else (
    echo %GREEN%安装成功！%RESET%
)
pause.exe 返回
goto :main

:uninstall_app
cls
ECHO %ORANGE%开始卸载应用
call rtosdevice
rtos list "%drive%"
echo.
set /p app_index=请输入要卸载的应用序号（输入 A 返回）：
if "%app_index%"=="A" goto :main
if "%app_index%"=="" goto :uninstall_app

echo %app_index%| findstr /r "^[0-9][0-9]*$" >nul
if errorlevel 1 (
    echo %error%请输入有效的数字
    pause.exe 重试
    goto :uninstall_app
)

rtos uninstall "%drive%" %app_index%
if errorlevel 1 (
    echo %error%卸载失败
) else (
    echo %GREEN%卸载成功%RESET%
)
pause.exe 返回
goto :main

:list_apps
cls
ECHO %ORANGE%列出已安装应用列表...
call rtosdevice
rtos list_gui "%drive%"
pause.exe 返回
goto :main

:export_app
cls
ECHO %ORANGE%开始导出应用...
call rtosdevice
rtos list "%drive%"
echo.
set /p export_index=请输入要导出的应用序号（输入 0 返回）：
if "%export_index%"=="0" goto :main
if "%export_index%"=="" goto :export_app

echo %export_index%| findstr /r "^[0-9][0-9]*$" >nul
if errorlevel 1 (
    echo %error%请输入有效的数字
    pause.exe 返回
    goto :export_app
)

echo %info%请选择导出目录& call sel folder s . 

rtos export "%drive%" "%sel__folder_path%" %export_index%
pause.exe 返回
goto :main

:at_tool
CLS
call logo
ECHO %ORANGE%AT指令工具%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\rtos-at_tool.json
set /p MENU=<menutmp.txt
if "%MENU%"=="A" goto :main
if "%MENU%"=="1" goto :at_public
if "%MENU%"=="2" goto :at_private

:at_public
CLS
call logo
ECHO %ORANGE%公用AT指令%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\rtos-at_public.json
set /p MENU=<menutmp.txt
if "%MENU%"=="A" goto :at_tool
if "%MENU%"=="1" set "at_cmd=AT+CGMI" & set "at_desc=查询模块制造商" & goto :at_run
if "%MENU%"=="2" set "at_cmd=AT+CGMM" & set "at_desc=查询模块型号" & goto :at_run
if "%MENU%"=="3" set "at_cmd=AT+CGMR" & set "at_desc=查询固件版本" & goto :at_run
if "%MENU%"=="4" set "at_cmd=AT+CGATT?" & set "at_desc=查询数据业务附着状态" & goto :at_run
if "%MENU%"=="5" set "at_cmd=AT+COPS?" & set "at_desc=查询当前注册的运营商网络" & goto :at_run
if "%MENU%"=="6" goto :at_pub_dial
if "%MENU%"=="7" set "at_cmd=AT+CEREG?" & set "at_desc=查询4G网络注册状态" & goto :at_run
if "%MENU%"=="8" goto :at_pub_sms
if "%MENU%"=="9" set "at_cmd=ATD*99#ONT=1" & set "at_desc=拨号上网" & goto :at_run
if "%MENU%"=="10" set "at_cmd=AT+SPLBAND=0" & set "at_desc=设置频段" & goto :at_run
if "%MENU%"=="11" set "at_cmd=AT+SPIMEI?" & set "at_desc=查询设备IMEI号" & goto :at_run
if "%MENU%"=="12" set "at_cmd=AT+CGDCONT?" & set "at_desc=查询PDP上下文配置" & goto :at_run
if "%MENU%"=="13" set "at_cmd=AT+CFUN=1,1" & set "at_desc=复位重启模块" & goto :at_run


:at_pub_dial
set /p at_phone=请输入电话号码：
if "!at_phone!"=="" (
    echo %error%电话号码不能为空
    pause
    goto :at_public
)
set "at_cmd=ATD!at_phone!"
set "at_desc=发起语音拨号：!at_phone!"
goto :at_run

:at_pub_sms
set /p at_phone=请输入电话号码（不带+86）：
if "!at_phone!"=="" (
    echo %error%电话号码不能为空
    pause
    goto :at_public
)
set /p at_msg=请输入短信内容：
set "at_cmd=AT+CMGS=+86!at_phone!"
set "at_desc=发送短信到 +86!at_phone!：!at_msg!"
goto :at_run

:at_private
CLS
call logo
ECHO %ORANGE%小天才私有AT指令%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\rtos-at_private.json
set /p MENU=<menutmp.txt
if "%MENU%"=="0" goto :at_tool
if "%MENU%"=="1" set "at_cmd=AT+BINDNUM" & set "at_desc=获取绑定号码" & goto :at_run
if "%MENU%"=="2" set "at_cmd=AT+DOWNLOADMODEL" & set "at_desc=获取机型" & goto :at_run
if "%MENU%"=="3" set "at_cmd=AT+DOWNLOADVERSION" & set "at_desc=获取设备版本号" & goto :at_run
if "%MENU%"=="4" set "at_cmd=AT+BATCAP" & set "at_desc=获取电池电量" & goto :at_run
if "%MENU%"=="5" set "at_cmd=AT+ELEQUAN" & set "at_desc=获取电池电量" & goto :at_run

:at_run
cls
ECHO %ORANGE%AT指令执行工具%Yellow%
echo.
echo 指令：!at_cmd!
echo 说明：!at_desc!
echo.
call rtosdevice detect_com
set /p baud_rate=请输入波特率（默认 115200）：
if "!baud_rate!"=="" set "baud_rate=115200"

echo.
echo %info%正在通过 !com_port! 发送指令...
if defined at_msg (
    rtos at "!com_port!" !baud_rate! "!at_cmd!" "!at_msg!"
) else (
    rtos at "!com_port!" !baud_rate! "!at_cmd!"
)
echo.
pause 返回
set "at_msg="
goto :at_public

:photo_viewer
cls
call logo
ECHO %ORANGE%相册
call rtosdevice

rtos photo "%drive%"
pause.exe 返回主菜单
goto :main

:call_records
cls
call logo
ECHO %ORANGE%通话记录
call rtosdevice

rtos call "%drive%"
pause.exe 返回主菜单
goto :main

:personal_center
cls
call logo
ECHO %ORANGE%个人中心
call rtosdevice

rtos personal "%drive%"
pause.exe 返回主菜单
goto :main

:rpk_store
cls
call logo
ECHO %ORANGE%RPK商店

rtos store
pause.exe 返回主菜单
goto :main

:app_store_switch
cls
call logo
ECHO %ORANGE%应用商店开关
call rtosdevice

rtos store_switch "%drive%"
pause.exe 返回主菜单
goto :main


