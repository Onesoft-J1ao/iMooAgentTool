echo.%info%补充声明：
if exist .\nouserdata.txt set /p nouserdata=<nouserdata.txt >nul
if not "%nouserdata%"=="1" echo.%info%Root会自动超级恢复
if "%nouserdata%"=="1" (
    echo.%info%你选择了不刷userdata，Root不会超级恢复，如果你不是特定版本会出现问题！！
    pause.exe
)

if "%innermodel%"=="ND03" (
    echo.%info%Root后版本为3.0.2,底包2.8.1
    set "modtype=EDLrec"
    set "DM=true"
    set "runmod=qmmi"
)
if "%innermodel%"=="ND08" (
    echo.%info%Root后版本为2.7.5
    set "modtype=FBrec"
    set "runmod=system"
)

echo.%info%Root文件为网络搜集而来
if exist .\EDL\rooting\info.txt set /p atbverinfo=<.\EDL\rooting\info.txt >nul
echo.%info%Root文件版本为%atbverinfo%
device_check.exe adb qcom_edl&&ECHO.
busybox sleep 2
for /f "delims=" %%i in ('type tmp.txt') do set devicestatus=%%i
if not "%devicestatus%"=="qcom_edl" (
    ECHO.%INFO%重启至9008模式
    run_cmd "adb reboot edl"
)

ECHO.%INFO%获取9008端口
call edlport
ECHO.%INFO%发送引导
call QSaharaServer.bat -p \\.\COM%chkdev__edl_port% -s 13:%cd%\EDL\prog_firehose_ddr.elf
busybox sleep 2

if "%modtype%"=="EDLrec" call :EDLrec

if "%modtype%"=="FBrec" call :FBrec

if "%DM%"=="true" call :DM

if "%runmod%"=="qmmi" call :qmmi

ECHO.%INFO%让我们等待重启三次修复环境
:test3
adb shell test -f /sdcard/AllToolBox > nul 2> nul
if %errorlevel%==0 (
    goto test3ok
)
goto test3
:test3ok
busybox sleep 5
call boot_completed.bat
busybox sleep 5
call boot_completed.bat
run_cmd "adb shell input keyevent 4"
echo.%info%模拟未充电状态
run_cmd "adb shell dumpsys battery unplug"
echo.%info%启用屏幕常亮
if "%runmod%"=="system" run_cmd "adb shell setprop persist.sys.keepScreenOn true"
if "%runmod%"=="qmmi" run_cmd "adb shell settings put system screen_off_timeout 2147483647"

if "%runmod%"=="system" run_cmd "adb shell am start -n android/com.android.internal.app.MoreActionActivity"

ECHO.%INFO%正在自动打开自动响应，请稍后
busybox sleep 2
run_cmd "adb shell am start -n com.xtc.b/com.topjohnwu.magisk.ui.MainActivity"
busybox sleep 7
run_cmd "adb shell wm density 288"
busybox sleep 2
device_check.exe adb&&ECHO.
busybox sleep 5
adb shell input tap 376 51
busybox sleep 0.5
adb shell input swipe 200 400 200 100
adb shell input swipe 200 400 200 100
adb shell input swipe 200 400 200 100
adb shell input swipe 200 400 200 100
adb shell input swipe 200 400 200 100
adb shell input swipe 200 400 200 100
adb shell input swipe 200 400 200 100
adb shell input swipe 200 400 200 100
busybox sleep 0.5
adb shell input tap 200 330
busybox sleep 0.5
adb shell input tap 200 180
busybox sleep 0.5
adb shell input swipe 200 200 200 300
busybox sleep 0.5
adb shell input tap 200 150
busybox sleep 0.5
adb shell input tap 200 315

adb shell "su -c magisk -v" || echo.%ERROR%自动授予出错及手动授予权限&&goto magisk
goto automagisk

:magisk
if "%runmod%"=="system" run_cmd "adb shell am start -n android/com.android.internal.app.MoreActionActivity"
run_cmd "adb shell am start -n com.xtc.b/com.topjohnwu.magisk.ui.MainActivity"
device_check.exe adb&&ECHO.
ECHO.%INFO%正在启动投屏！如手表端不方便操作，可在电脑端进行操作
ECHO.%INFO%提示：如果手表息屏，在投屏窗口单击右键即可
start scrcpy-noconsole.vbs
ECHO.%INFO%请打开Magisk右上角设置，往下滑，找到自动响应，修改为允许，然后找到超级用户通知，修改为无
ECHO.%INFO%然后在主页点击超级用户，将所有开关打开
ECHO.%INFO%操作完成后请按任意键继续
pause.exe
adb shell "su -c magisk -v" || echo.%ERROR%授予出错，请重新授予&&goto magisk

:automagisk
ECHO.%ORANGE%--------------------------------------------------------------------
ECHO.%PINK%-把时间交给我们-
device_check.exe adb&&ECHO.
ECHO.%INFO%开始安装XTC Patch模块
adb push tmp\xtcpatch.zip /sdcard/xtcpatch.zip
adb shell "su -c magisk --install-module /sdcard/xtcpatch.zip"
run_cmd "adb shell ""rm -rf /sdcard/xtcpatch.zip"""
ECHO.%INFO%安装XTC Patch模块成功
run_cmd "adb shell pm clear com.android.packageinstaller"
ECHO.%INFO%开始安装核心破解和systemplus
call instapp.bat .\apks\toolkit_4.8.apk important
call instapp.bat .\apks\Z10_SystemPlus.apk important
run_cmd "adb shell ""su -c am start -n org.lsposed.manager/.ui.activity.MainActivity"""
ECHO.%INFO%正在自动激活lsp模块，勾选作用域，请稍后
run_cmd "adb shell su -c /data/adb/modules/riru_lsposed/lspd-cli activate com.coderstory.toolkit --scope system,com.coderstory.toolkit"
run_cmd "adb shell su -c /data/adb/modules/riru_lsposed/lspd-cli activate com.zcg.systemplus --scope system,com.android.permissioncontroller,com.xtc.keystore,com.xtc.setting,com.xtc.alarmclock,com.xtc.selftest,com.xtc.funphoto,com.xtc.photolearn,com.xtc.vassistant,com.xtc.osweichat,com.xtc.bleaddfriend,com.xtc.aqs,com.xtc.xws,com.xtc.moment,com.xtc.videochat,com.xtc.xtcime,com.xtc.apnsettings,com.xtc.validationtest,com.xtc.absystemupdate,com.xtc.cloudservice,com.xtc.intelligentIdentify,com.xtc.appupdate,com.xtc.album,com.xtc.sport,com.xtc.theme,com.xtc.b,com.xtc.datacenter,com.xtc.i3launcher,com.xtc.healthcheck,com.xtc.xtcdialer,com.xtc.message,com.xtc.personalcenter,com.xtc.wcnbigdata,com.xtc.systemagent,com.xtc.mmitest,com.xtc.camera.app,com.xtc.weather,com.xtc.weichat,com.xtc.cardpack,com.xtc.migration,com.android.systemui,com.zcg.systemplus"

ECHO.%INFO%即将完成
run_cmd "adb shell wm density reset"
run_cmd "adb shell dumpsys battery reset"

if "%runmod%"=="qmmi" run_cmd "adb shell settings put system screen_off_timeout 30"
if "%runmod%"=="system" run_cmd "adb shell setprop persist.sys.keepScreenOn false"

if "%runmod%"=="qmmi" call :exitqmmi
ECHO.%INFO%重新启动保存修改
run_cmd "adb reboot"
ECHO.%INFO%等待手表开机
device_check.exe adb&&ECHO.
call boot_completed.bat
busybox sleep 5
ECHO.%INFO%开始安装预装应用

call instapp.bat .\apks\appsettings-ND03.apk
call instapp.bat .\apks\appmanager.apk
call instapp.bat .\apks\wcp2.apk
call instapp.bat .\apks\appstore.apk
if "%innermodel%"=="ND03" call instapp.bat .\apks\MoyeInstaller.apk
if exist .\apks\appstore2.apk call instapp.bat .\apks\appstore2.apk
if exist .\apks\appstore3.apk call instapp.bat .\apks\appstore3.apk
if exist .\apks\appstore4.apk call instapp.bat .\apks\appstore4.apk
ECHO.%INFO%预装应用安装完成
:ROOT-noapp
ECHO.%INFO%正在执行提前编译，可能需要一些时间
run_cmd "adb shell cmd package compile -m everything-profile -f com.xtc.i3launcher"
run_cmd "adb shell cmd package compile -m everything-profile -f com.xtc.setting"
ECHO.%GRAY%-跨越山海 终见曙光-

ECHO.%INFO%您的手表已ROOT完毕，耗时：
timer end root
pause.exe
exit /b




:EDLrec
if exist .\nouserdata.txt set /p nouserdata=<nouserdata.txt >nul
if "%nouserdata%"=="1" goto skiprec1
ECHO.%INFO%刷入恢复固件
progress.exe P_fh_loader.bat --showpercentagecomplete --port=\\.\COM%chkdev__edl_port% --memoryname=EMMC --search_path=EDL\rooting\281\ --sendxml=EDL\rooting\281\rawprogram0.xml --noprompt
if exist "%cd%\fh_error.txt" (
    echo %error%恢复失败!刷入失败!
    pause.exe 返回
    exit /b
)
call fh_loader.bat --port=\\.\COM%chkdev__edl_port% --memoryname=EMMC --search_path=EDL\rooting\281\ --sendxml=EDL\rooting\281\patch0.xml --noprompt
:skiprec1
ECHO.%INFO%刷入root固件
progress.exe P_fh_loader.bat --showpercentagecomplete --port=\\.\COM%chkdev__edl_port% --memoryname=EMMC --search_path=EDL\rooting\ --sendxml=EDL\rooting\rawprogram0.xml --noprompt
copy /Y "%cd%\tmp\eboot.img" "%cd%\EDL\rooting\eboot.img"
if exist "%cd%\fh_error.txt" (
    echo %error%root失败!刷入失败!
    pause.exe 返回
    exit /b
)
ECHO.%INFO%清除boot
call fh_loader.bat --port=\\.\COM%chkdev__edl_port% --memoryname=EMMC --search_path=EDL\rooting --sendxml=EDL\rooting\eboot.xml --noprompt
ECHO.%INFO%重启手表
call qfh_loader.bat --port=\\.\COM%chkdev__edl__port% --memoryname=EMMC --search_path=EDL\ --sendxml=reboot.xml --noprompt
ECHO.%WARN%你的手表没有变砖!
ECHO.%WARN%你的手表没有变砖!
ECHO.%WARN%你的手表没有变砖!
ECHO.%WARN%不是进入fastboot就是变砖！
ECHO.%INFO%等待fastboot连接...
device_check.exe fastboot&&ECHO.
ECHO.%INFO%刷入boot
run_cmd "fastboot flash boot EDL\rooting\boot.img"
if not "%DM%"=="true" run_cmd "fastboot reboot"
exit /b


:FBrec
ECHO.%INFO%刷入root固件
progress.exe P_fh_loader.bat --showpercentagecomplete --port=\\.\COM%chkdev__edl_port% --memoryname=EMMC --search_path=EDL\rooting\ --sendxml=EDL\rooting\rawprogram0.xml --noprompt
if exist "%cd%\fh_error.txt" (
    echo %error%恢复失败!刷入失败!
    pause.exe 返回
    exit /b
)
ECHO.%INFO%重启手表
call qfh_loader.bat --port=\\.\COM%chkdev__edl__port% --memoryname=EMMC --search_path=EDL\ --sendxml=reboot.xml --noprompt
ECHO.%WARN%你的手表没有变砖!
ECHO.%WARN%你的手表没有变砖!
ECHO.%WARN%你的手表没有变砖!
ECHO.%WARN%不是进入fastboot就是变砖！
ECHO.%INFO%等待fastboot连接...
device_check.exe fastboot&&ECHO.
if exist .\nouserdata.txt set /p nouserdata=<nouserdata.txt >nul
if "%nouserdata%"=="1" goto skiprec2
ECHO.%INFO%切换到a系统槽位
run_cmd "fastboot set_active a"
ECHO.%INFO%恢复2.7.5系统
run_cmd "fastboot flash bluetooth_a EDL\rooting\bluetooth.img"
run_cmd "fastboot flash devcfg_a EDL\rooting\devcfg.img"
run_cmd "fastboot flash dsp_a EDL\rooting\dsp.img"
run_cmd "fastboot flash dtbo_a EDL\rooting\dtbo.img"
run_cmd "fastboot flash hyp_a EDL\rooting\hyp.img"
run_cmd "fastboot flash keymaster_a EDL\rooting\keymaster.img"
run_cmd "fastboot flash modem_a EDL\rooting\modem.img"
run_cmd "fastboot flash multiimgoem_a EDL\rooting\multiimgoem.img"
run_cmd "fastboot flash qupfw_a EDL\rooting\qupfw.img"
run_cmd "fastboot flash recovery_a EDL\rooting\recovery.img"
run_cmd "fastboot flash rpm_a EDL\rooting\rpm.img"
run_cmd "fastboot flash uefisecapp_a EDL\rooting\uefisecapp.img"
run_cmd "fastboot flash vbmeta_a EDL\rooting\vbmeta.img"
run_cmd "fastboot flash vbmeta_system_a EDL\rooting\vbmeta_system.img"
run_cmd "fastboot flash xbl_a EDL\rooting\xbl.img"
run_cmd "fastboot flash xbl_config_a EDL\rooting\xbl_config.img"
run_cmd "fastboot flash tz_a EDL\rooting\tz.img"
ECHO.%INFO%恢复完成
ECHO.%INFO%清除userdata
run_cmd "fastboot flash misc EDL\rooting\misc.img"
:skiprec2
ECHO.%INFO%刷入boot
run_cmd "fastboot flash boot_a EDL\rooting\boot.img"
if not "%DM%"=="true" run_cmd "fastboot reboot"
exit /b


:DM
ECHO.%INFO%重启并进入recovery
run_cmd "fastboot boot EDL\rooting\recovery.img"
ECHO.%INFO%坐和放宽，让我们等待您的手表一段时间
ECHO.%INFO%进入sideload
call adbdevice.bat sideload
ECHO.%INFO%正在刷dm，请等待20秒...
busybox timeout 20 cmd /c adb sideload .\EDL\rooting\Dm.zip
ECHO.
call adbdevice.bat noadb
ECHO.═══════════════════════
exit /b


:qmmi
ECHO.%WARN%你的手表没有变砖!
ECHO.%WARN%你的手表没有变砖!
ECHO.%WARN%你的手表没有变砖!
ECHO.%WARN%不是进入fastboot就是变砖！
ECHO.%INFO%等待fastboot连接...
device_check.exe fastboot&&ECHO.
ECHO.%INFO%刷入misc并重启
echo ffbm-02 > misc.bin
run_cmd "fastboot flash misc misc.bin"
run_cmd "fastboot reboot"
exit /b


:exitqmmi
ECHO.%INFO%擦除misc并重启
run_cmd "adb reboot bootloader"
device_check.exe adb fastboot&&ECHO.
for /f "delims=" %%i in ('type tmp.txt') do set devicestatus=%%i
if "!devicestatus!"=="adb" (
    run_cmd "adb reboot bootloader"
)
run_cmd "fastboot erase misc"
run_cmd "fastboot reboot"
exit /b