
:run
QSaharaServer.exe %* >QStmp.txt || goto error
exit /b
:error
call nutime
copy /Y .\QStmp.txt .\logs\QSerror_%nutime%.txt >nul
set QStmp=""

find /i "Unable to read packet" "%cd%\QStmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%无法读取数据包，设备连接不稳定，数据传输失败%RESET%
)

find /i "Sahara protocol error" "%cd%\QStmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%Sahara 协议错误，设备通信中断，或与指定的引导文件不匹配%RESET%
)

find /i "Failed to open com port" "%cd%\QStmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%无法打开 COM 端口，端口可能被占用，或设备不存在%RESET%
)

find /i "Could not connect to" "%cd%\QStmp.txt" >nul
if !errorlevel! equ 0 (
    echo %Yellow%无法连接到指定 COM 端口，端口可能被占用，或设备不存在%RESET%
    echo %Yellow%建议解决方法：关闭后台的刷机工具，如刷机匣，QFIL
)

set /p QStmp=%error%9008引导失败！[输入"log"输出详细日志]按任意键重新尝试...
if "%QStmp%"=="log" (
type QStmp.txt
pause.exe 重试...
call edlport
)
goto run