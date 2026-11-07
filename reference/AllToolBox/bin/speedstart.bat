
set PATH=%cd%;%PATH%;C:\Windows\system32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0;C:\Windows\System32\OpenSSH
set PATHEXT=%PATHEXT%;.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC
set /p="%cd%" <nul | find " " 1>nul 2>nul && ECHO %ERROR%当前工具所在路径含有空格，请尝试将工具移动到其他位置%RESET%&& pause.exe&&exit /b
set workcd=%cd%
set /p whoyou=<whoyou.txt
call checkdriver

adb version 1>nul 2>nul
if %errorlevel% neq 0 (
    ECHO %ERROR%ADB检查失败%RESET%
    timeout /t 2 /nobreak >nul
    exit
)
set /p="2" <nul > whoyou.txt
busybox sleep 0.1