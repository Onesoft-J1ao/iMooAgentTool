if "%1"=="detect_drive" goto detect_drive
if "%1"=="detect_com" goto detect_com
if "%1"=="com" goto detect_com
if "%1"=="drive" goto detect_drive
if "%1"=="port" goto detect_com

:detect_drive
setlocal
echo %INFO%%RESET%%BLUE%正在查找 XTC U盘设备%RESET%
set try_times=1
set again=1
:scan_start
busybox sleep 1
if %try_times% GTR 120 (
    echo %ERROR%连接 XTC U盘设备超时!%RESET%
    pause.exe 重试
    set try_times=1
)
set /a try_times+=1

set count=0
set "drive="
for %%d in (C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
    if exist "%%d:\quickapp" (
        set /a count+=1
        set "drive=%%d:"
    )
)
if !count! EQU 0 (
    busybox sleep 1
    goto scan_start
)
if !count! GTR 1 (
    echo %ERROR%有多个盘符包含quickapp! 请断开其他设备.%RESET%
    pause.exe 重试
    goto scan_start
)
:: 目标设备已检测到
if not %again% GTR 1 (
    set /a again+=1
    set try_times=1
    goto scan_start
)
echo %INFO%检测到盘符：!drive!%RESET%
ENDLOCAL & set chkdev__xtc_drive=%drive%& set xtc_drive=%drive%& set drive=%drive%
exit /b

:detect_com
setlocal
echo %INFO%%RESET%%BLUE%正在检测可用串口...%RESET%
set try_times=1
set again=1

:scan_com
busybox sleep 1
if !try_times! GTR 120 (
    echo %ERROR%检测串口超时，请检查连接！%RESET%
    pause.exe 重试
    set try_times=1
)
set /a try_times+=1

set "com_found=0"
for /f "usebackq delims=" %%p in (`rtos com_list 2^>nul`) do (
    set "com_found=1"
    set "com_port=%%p"
    goto :found
)
goto :scan_com

:found
:: 首次检测到后，再扫描一次确认
if not !again! GTR 1 (
    set /a again+=1
    set try_times=1
    goto :scan_com
)
echo %INFO%检测到串口: !com_port!%RESET%
ENDLOCAL & set com_port=%com_port%& set chkdev__com_port=%com_port%
exit /b