


:: call checkmd5
:: 清单文件格式示例：
:: 26ecb32db5b85380d3e862caf75ff826  ./7z.dll
:: 2433379ecd9292a3ecaeffdacead90d4  ./AdbWinApi.dll
:start
call :check .\settings\dll_md5.txt
call :check .\settings\exe_md5.txt
exit /b 0
:check
set "LISTFILE=%~1"

for /f "usebackq tokens=1,*" %%A in ("%LISTFILE%") do (
    set "EXPECTED=%%A"

    set "CHECK_FILE=%%B"
    if not exist ".\!CHECK_FILE!" echo %error%关键依赖文件缺失 - "!CHECK_FILE!"
    for /f "tokens=1" %%C in ('busybox md5sum "!CHECK_FILE!"') do set "ACTUAL=%%C"

    if not "!ACTUAL!"=="!EXPECTED!" (
        echo %error%MD5校验失败！文件可能被篡改 - "!CHECK_FILE!"
        pause
        echo %error%重新尝试校验...
        goto start
    )
)

exit /b 0

:: :check_run
:: set "check_dll=.\settings\atb_dll.txt"
:: set "check_exe=.\settings\atb_exe.txt"
:: for /f "usebackq" %%f in ("%check_dll%") do (
    :: set "CHECK_FILE=%%f"
    :: call :check
:: )

:: for /f "usebackq" %%f in ("%check_exe%") do (
    :: set "CHECK_FILE=%%f"
    :: call :check
:: )


:: :check
:: fc /b "!CHECK_FILE!" "!CHECK_FILE!.backup" 1>nul 2>nul
:: if not !errorlevel! == 0 (
    :: echo %error%校验失败！文件可能被篡改 - "!CHECK_FILE!"
    :: echo %info%正在恢复文件...
    :: if exist "!CHECK_FILE!.backup" (
        :: copy /y "!CHECK_FILE!.backup" "!CHECK_FILE!" 1>nul 2>nul
    :: ) else (
        :: echo %error%备份文件已丢失,程序无法运行 - "!CHECK_FILE!.backup"
        :: pause
        :: goto check_run
    :: )
:: )