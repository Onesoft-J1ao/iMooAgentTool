@echo off 

if "%1"=="DCIM" goto DCIM
if "%1"=="EDL" goto EDL
if "%1"=="9008" goto EDL
if "%1"=="adb" goto adb-dd

:MAIN_MENU
CLS
call logo.bat
ECHO %ORANGE%备份与恢复菜单%YELLOW%
menu.exe .\menu\backup.json
set /p MENU=<menutmp.txt
if "%MENU%"=="A" exit /b
if "%MENU%"=="a" exit /b
if "%MENU%"=="1" goto DCIM-backup
if "%MENU%"=="2" goto DCIM-recover
if "%MENU%"=="3" goto 9008-backup
if "%MENU%"=="4" goto 9008-recover
if "%MENU%"=="5" goto adb-dd-backup
if "%MENU%"=="6" goto adb-dd-recover
ECHO %ERROR%输入错误，请重新输入！%RESET%
timeout /t 2 >nul
goto MAIN_MENU

:adb-dd
if "%2"=="recover" goto adb-dd-recover
if "%2"=="backup" goto adb-dd-backup
exit /b

:EDL
if "%2"=="recover" goto 9008-recover
if "%2"=="backup" goto 9008-backup
exit /b

:DCIM
if "%2"=="recover" goto DCIM-recover
if "%2"=="backup" goto DCIM-backup
exit /b

:DCIM-recover
if "%3"=="noask" goto DCIM-recover-noask
echo %INFO%你要从哪个文件夹进行恢复？%RESET%
call sel folder s %cd%\backup
echo.%info%正在恢复相册...
call adbdevice adb
adb push "%sel__folder_path%\DCIM" /storage/emulated/0/
if %errorlevel%==0 (
    echo.%info%恢复成功
) else (
    echo.%error%恢复失败
)
pause.exe 返回
exit /b
:DCIM-recover-noask
echo.%info%正在恢复相册...
call adbdevice adb
adb push ".\backup\%backupname%\DCIM" /storage/emulated/0/
if %errorlevel%==0 (
    echo.%info%恢复成功
) else (
    echo.%error%恢复失败
)
exit /b
:DCIM-backup
if "%3"=="noask" goto DCIM-backup-noask
echo %INFO%你要将相册备份到哪个文件夹内？%RESET%
call sel folder s %cd%\backup
echo.%info%正在备份相册...
call adbdevice adb
adb pull /storage/emulated/0/DCIM "%sel__folder_path%"
if %errorlevel%==0 (
    echo.%info%备份成功
) else (
    echo.%error%备份失败
)
pause.exe 返回
exit /b
:DCIM-backup-noask
echo.%info%正在备份相册...
call adbdevice adb
for /f "delims=" %%i in ('adb shell getprop ro.product.model') do set model=%%i
set backupname=DCIM_%model%_%RANDOM%
mkdir .\backup\%backupname%
adb pull /storage/emulated/0/DCIM ".\backup\%backupname%"
if %errorlevel%==0 (
    echo.%info%备份成功
) else (
    echo.%error%备份失败
)
exit /b 


:9008-recover
echo.%info%请选择恢复文件
call sel file s %cd%\backup [zip]
copy /y %sel__file_path% .\backup\tmp.zip
progress.exe 7z x .\backup\tmp.zip -o.\backup\tmp\ -aoa -bsp1
set /p v3=<.\backup\tmp\%backupname%\v3.txt
set "backupname=%sel__file_name%"
device_check.exe qcom_edl&&ECHO.
call edlport
echo.%info%发送引导
if "%v3%"=="1" (
    call QSaharaServer.bat -p \\.\COM%chkdev__edl_port% -s 13:%cd%\EDL\msm8937.mbn
) else (
    call QSaharaServer.bat -p \\.\COM%chkdev__edl_port% -s 13:%cd%\EDL\msm8909w.mbn
)
busybox sleep 2
echo.%info%正在恢复...
call fh_loader.bat --port=\\.\COM%chkdev__edl_port% --memoryname=EMMC --search_path=%cd%\backup\tmp\%backupname%\ --sendxml=%cd%\backup\tmp\%backupname%\rawprogram0.xml --noprompt
rd /Q /S .\backup\tmp >nul 2>nul
del /Q /F .\backup\tmp.zip >nul 2>nul
echo.%info%恢复完成
pause.exe
exit /b

:9008-backup
CLS
call logo
echo %ORANGE%请选择手表型号[暂时仅支持以下型号]%YELLOW%
menu.exe .\menu\backup_9008.json
set /p MENU=<menutmp.txt
if "%MENU%"=="A" goto MAIN_MENU
if "%MENU%"=="1" set innermodel=I13C&&set v3=0&&goto 9008-backup-run
if "%MENU%"=="2" set innermodel=I13&&set v3=0&&goto 9008-backup-run
if "%MENU%"=="3" set innermodel=I19&&set v3=0&&goto 9008-backup-run
if "%MENU%"=="4" set innermodel=I20&&set v3=1&&goto 9008-backup-run
if "%MENU%"=="5" set innermodel=I25&&set v3=1&&goto 9008-backup-run
if "%MENU%"=="6" set innermodel=I25D&&set v3=1&&goto 9008-backup-run
if "%MENU%"=="7" set innermodel=I32&&set v3=1&&goto 9008-backup-run
if "%MENU%"=="8" set innermodel=ND07&&set v3=1&&goto 9008-backup-run
if "%MENU%"=="9" set innermodel=ND01&&set v3=1&&goto 9008-backup-run
ECHO %ERROR%输入错误，请重新输入！%RESET%
timeout /t 2 >nul
goto 9008-backup

:9008-backup-run
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set d=%%a%%b%%c
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set t=%%a%%b

set backupname=EDL_%innermodel%_%d%_%t%
md .\backup\%backupname% >nul 2>nul
del /Q /F .\*.img >nul 2>nul
device_check.exe qcom_edl&&ECHO.
call edlport
echo.%info%发送引导
if "%v3%"=="1" (
    call QSaharaServer.bat -p \\.\COM%chkdev__edl_port% -s 13:%cd%\EDL\msm8937.mbn
) else (
    call QSaharaServer.bat -p \\.\COM%chkdev__edl_port% -s 13:%cd%\EDL\msm8909w.mbn
)
busybox sleep 2
echo.%info%正在备份...
call fh_loader.bat --port=\\.\COM%chkdev__edl_port% --memoryname=EMMC --sendxml=%cd%\EDL\allxml\%innermodel%.xml --convertprogram2read --noprompt --mainoutputdir="%cd%\backup\%backupname%\"
ECHO.%INFO%重启手表
call qfh_loader.bat --port=\\.\COM%chkdev__edl__port% --memoryname=EMMC --search_path=EDL\ --sendxml=reboot.xml --noprompt
ECHO.%INFO%构建属性文件
copy /y .\*.img .\backup\%backupname%\
set /p="%v3%" <nul > .\backup\%backupname%\v3.txt
copy /y .\EDL\allxml\%innermodel%.xml .\backup\%backupname%\rawprogram0.xml
ECHO.%INFO%压缩文件
progress.exe 7z a -tzip -y .\backup\%backupname%.zip .\backup\%backupname%\ -bsp1
rd /Q /S .\backup\%backupname% >nul 2>nul
ECHO.%INFO%备份完成，文件存于bin\backup\%backupname%.zip
pause.exe 返回
exit /b

:adb-dd-backup
echo %info%Android 全分区(不含ud)备份 (dd读取)
echo %info%需要 root 权限和充足电脑存储空间

for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set d=%%a%%b%%c
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set t=%%a%%b
set backupname=ADB_%d%_%t%
md .\backup\%backupname%
echo %info%等待设备连接...
call adbdevice.bat adb
call adbdevice.bat root
if %errorlevel% neq 0 (
    echo %error%没有root权限,请尝试进入twrp/qmmi
    pause.exe 返回
    exit /b
)

REM ========== 动态获取 by-name 目录路径 ==========
echo %info%正在查找 by-name 目录...
set "BY_NAME_PATH="
for /f "delims=" %%a in ('adb shell !suroot! find /dev/block -type d -name by-name 2^>nul') do (
    set "BY_NAME_PATH=%%a"
    goto :found_by_name
)
:found_by_name
if not defined BY_NAME_PATH (
    echo %error%未找到 by-name 目录，请检查设备是否支持或 root 权限是否正常。
    pause.exe 返回
    exit /b
)
echo %info%找到 by-name 目录: %BY_NAME_PATH%
REM ==============================================

echo %info%正在获取分区列表...
set PART_LIST=
for /f "tokens=*" %%i in ('adb shell "!suroot! ls %BY_NAME_PATH%" 2^>nul') do (
    set PART_LIST=%%i
)
if not defined PART_LIST (
    echo %error%无法获取分区列表，请检查 root 权限或设备支持。
    pause.exe 返回
    exit /b
)
set "ERRORPART=备份失败的分区:"
echo %info%开始备份分区...
for /f %%p in ('adb shell "!suroot! ls %BY_NAME_PATH%"') do (
    set PART=%%p
    if /i "!PART!"=="userdata" (
        echo %info%跳过userdata
        set PART=
    ) else (
        echo.
        echo %info%正在备份分区: !PART! ...
        set PART_DEV=%BY_NAME_PATH%/!PART!
        set IMG_FILE=!PART!.img
        adb exec-out "!suroot! dd if=!PART_DEV! bs=4096" 2>nul >.\backup\!backupname!\!IMG_FILE!
        if !errorlevel! neq 0 (
            echo %error%分区 !PART! 备份可能失败，继续下一个...
            set "ERRORPART=!ERRORPART! !PART!"
        ) else (
            echo %Green%备份!PART!已完成
        )
    )
)

echo %info%正在校验备份文件完整性...
for %%f in (.\backup\%backupname%\*.img) do (
    set "PART=%%~nf"
    set "REAL_DEV=%BY_NAME_PATH%/!PART!"

    echo %info%正在校验!PART!...
    set "REMOTE_HASH="
    for /f "delims=" %%h in ('adb shell "!suroot! md5sum !REAL_DEV!" 2^>/dev/null') do (
        for /f "tokens=1" %%v in ("%%h") do set "REMOTE_HASH=%%v"
    )

    if not defined REMOTE_HASH (
        echo %error%无法获取分区 !PART! 的MD5，跳过校验
    ) else (

        set "LOCAL_HASH="
        for /f "tokens=1" %%h in ('busybox md5sum "%%f" 2^>nul') do set "LOCAL_HASH=%%h"
        if not defined LOCAL_HASH (
            echo %error%无法计算本地文件 !PART!.img 的MD5，跳过校验
        ) else (
            if /i not "!LOCAL_HASH!"=="!REMOTE_HASH!" (
                echo %error%分区 !PART! 备份校验失败，删除不匹配文件
                set "ERRORPART=!ERRORPART! !PART!"
                del /Q /F "%%f"
            ) else (
                echo %Green%分区 !PART! 校验通过
            )
        )
    )
)

REM 仅在存在失败分区时打印错误列表
if not "!ERRORPART!"=="备份失败的分区:" (
    echo %error%!ERRORPART!
)

REM ========== 生成 fastboot 刷入脚本（静态命令，无循环） ==========
ECHO.%INFO%生成刷机脚本...
(for %%f in (.\backup\%backupname%\*.img) do (
    echo fastboot flash %%~nf %%~nxf
)) > .\backup\%backupname%\flash_all.bat

(for %%f in (.\backup\%backupname%\*.img) do (
    echo fastboot flash %%~nf %%~nxf
)) > .\backup\%backupname%\flash_all.sh
REM ================================================================

ECHO.%INFO%压缩文件
progress.exe 7z a -tzip -y .\backup\%backupname%.zip .\backup\%backupname%\ -bsp1
rd /Q /S .\backup\%backupname% >nul 2>nul
ECHO.%INFO%备份完成，文件存于bin\backup\%backupname%.zip
pause.exe 返回
exit /b

:adb-dd-recover
echo %info%Android 全分区(不含ud)恢复 (dd写入)
echo %info%需要 root 权限
echo %Red%此操作可能使设备变砖!
echo.%info%请选择恢复文件
call sel file s %cd%\backup [zip]
copy /y %sel__file_path% .\backup\tmp.zip
rd /Q /S .\backup\tmp >nul 2>nul
md .\backup\tmp
progress.exe 7z x .\backup\tmp.zip -o.\backup\tmp\ -aoa -bsp1
for /f "delims=" %%i in ('dir /b .\backup\tmp\') do set backupname=%%i
pushd .\backup\tmp\%backupname%\
dir /b *.img >nul 2>&1
if %errorlevel% neq 0 (
    echo %error%备份文件中没有找到任何 .img 文件。
    popd
    pause.exe 返回
    exit /b 1
)
popd
echo %info%等待设备连接...
call adbdevice.bat adb
call adbdevice.bat root
if %errorlevel% neq 0 (
    echo %error%没有root权限,请尝试进入twrp/qmmi
    pause.exe 返回
    exit /b
)

REM ========== 动态获取 by-name 目录路径 ==========
echo %info%正在查找 by-name 目录...
set "BY_NAME_PATH="
for /f "delims=" %%a in ('adb shell !suroot! find /dev/block -type d -name by-name 2^>nul') do (
    set "BY_NAME_PATH=%%a"
    goto :found_by_name
)
:found_by_name_rec
if not defined BY_NAME_PATH (
    echo %error%未找到 by-name 目录，请检查设备是否支持或 root 权限是否正常。
    pause.exe 返回
    exit /b
)
echo %info%找到 by-name 目录: %BY_NAME_PATH%
REM ==============================================

echo %info%正在获取设备分区表...
set "PART_LIST_FILE=.\backup\tmp\%backupname%\partitions.txt"
adb shell "!suroot! ls %BY_NAME_PATH%" > "%PART_LIST_FILE%" 2>nul
if not exist "%PART_LIST_FILE%" (
    echo %error%无法获取分区列表，请检查 root 权限或设备支持。
    pause.exe
    exit /b 1
)

echo.
echo %info%以下分区将从备份目录中恢复:
set "RESTORE_LIST="
set COUNT=0
for %%f in (.\backup\tmp\%backupname%\*.img) do (
    set "PART=%%~nf"

    findstr /i /b /c:"!PART!" "%PART_LIST_FILE%" >nul
    if !errorlevel! equ 0 (
        echo   - !PART!  匹配
        set "RESTORE_LIST=!RESTORE_LIST! !PART!"
        set /a COUNT+=1
    ) else (
        echo   - !PART!  未在设备中发现，跳过
    )
)

if %COUNT% equ 0 (
    echo %error%没有可恢复的分区
    del "%PART_LIST_FILE%"
    pause.exe 返回
    exit /b 1
)

echo.
ECHO.%YELLOW%是否确认恢复以上分区？
del /Q /F .\menutmp.txt >nul 2>nul

menu.exe .\menu\yesno.json
set /p CONFIRM=<menutmp.txt

if /i not "!CONFIRM!"=="y" (
    echo %info%已取消操作
    del "%PART_LIST_FILE%"
    pause.exe 返回
    exit /b 0
)


for %%f in (!RESTORE_LIST!) do (
    set PART=%%f
    set IMG_FILE=!PART!.img
    echo.
    echo %info%恢复分区: !PART! ...

    set PART_DEV=%BY_NAME_PATH%/!PART!
    echo %info%写入分区...
    adb.exe exec-in "!suroot! dd of=!PART_DEV! bs=4096" 2>nul <.\backup\tmp\%backupname%\!IMG_FILE!
    if !errorlevel! neq 0 (
        echo %error%!PART! 写入可能失败，请检查！
    ) else (
        echo %Green% !PART! 恢复成功
    )

)


del "%PART_LIST_FILE%" >nul 2>&1

echo %info%恢复流程结束，建议重启设备。
pause.exe 返回
exit /b
