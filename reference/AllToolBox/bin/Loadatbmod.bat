for /f %%i in ('dir /ad /b "%cd%\mod" 2^>nul ^| findstr /v /e "_old _tmp" ^| find /c /v ""') do set "ATB_running_mod=%%i"

:: --- 收集待处理的模块文件列表 ---
set "FILE_LIST="
set "FILE_COUNT=0"

for %%f in (*.atbmod) do (
    set /a FILE_COUNT+=1
    set "FILE_LIST=!FILE_LIST! "%%f""
)
if !FILE_COUNT! equ 0 (
    ECHO %INFO%没有可用alltoolbox模块%RESET%
    exit /b
)

:: 遍历处理每个模块
set "CURRENT=0"
set "SUCCESS_COUNT=0"
set "FAIL_COUNT=0"

for %%F in (!FILE_LIST!) do (
    set /a CURRENT+=1
    call :ProcessModule %%F
)
echo %WARN% %FAIL_COUNT% 个模块安装失败
echo %info% %SUCCESS_COUNT% 个模块安装成功
exit /b

:ProcessModule
:: 参数 %1 = 模块文件完整路径
set "MODULE=%~1"
if not exist "!MODULE!" (
    echo %error% 文件已不存在，跳过!
    set /a FAIL_COUNT+=1
    goto :eof
)

:: 创建独立临时目录（在当前目录下）
md "%cd%\mod" 1>nul 2>nul
call nutime
set "TEMPDIR=%cd%\mod\atbmod_!nutime!_tmp"
md "!TEMPDIR!" 1>nul 2>nul
if errorlevel 1 (
    echo %error% 无法创建临时目录，跳过。
    ren "!MODULE!" "%~nx1.end" 1>nul 2>nul
    set /a FAIL_COUNT+=1
    goto :eof
)

:: 解压
echo 正在解压...
7z.exe x "!MODULE!" -o"!TEMPDIR!" -y >nul
if errorlevel 1 (
    echo %error% 解压失败，模块可能已损坏。
    rd /s /q "!TEMPDIR!" 1>nul 2>nul
    ren "!MODULE!" "%~nx1.end" 1>nul 2>nul
    set /a FAIL_COUNT+=1
    goto :eof
)

if not exist "!TEMPDIR!\atbmod.prop" (
    echo %error% 模块不完整或格式不正确,缺少atbmod.prop
    rd /s /q "!TEMPDIR!" 1>nul 2>nul
    ren "!MODULE!" "%~nx1.end" 1>nul 2>nul
    set /a FAIL_COUNT+=1
    goto :eof
)

:: 读取 modid
call :GetModId "!TEMPDIR!\atbmod.prop"
if "!MODID!"=="" (
    echo %error% 模块不完整或格式不正确,缺少modid
    rd /s /q "!TEMPDIR!" 1>nul 2>nul
    ren "!MODULE!" "%~nx1.end" 1>nul 2>nul
    set /a FAIL_COUNT+=1
    goto :eof
)

if "!MODVERSIONCODE!"=="" (
    echo %error% 模块不完整或格式不正确,缺少modversioncode
    rd /s /q "!TEMPDIR!" 1>nul 2>nul
    ren "!MODULE!" "%~nx1.end" 1>nul 2>nul
    set /a FAIL_COUNT+=1
    goto :eof
)
echo %info%模块名称: !MODNAME!
echo %info%模块版本号: !MODVERSION!
echo %info%模块类型:!MODTYPE!
ECHO.%YELLOW%是否安装此模块？

menu.exe .\menu\yesno.json
set /p CONFIRM=<menutmp.txt
if not "%CONFIRM%"=="y" (
    echo %info%已取消安装
    rd /s /q "!TEMPDIR!" 1>nul 2>nul
    ren "!MODULE!" "%~nx1.end" 1>nul 2>nul
    set /a FAIL_COUNT+=1
    goto :eof
)


set "INSTALLER="
if exist "!TEMPDIR!\install.bat" (
    set "INSTALLER=!TEMPDIR!\install.bat"
) else if exist "!TEMPDIR!\install.exe" (
    set "INSTALLER=!TEMPDIR!\install.exe"
)
if not defined INSTALLER (
    echo %error% 模块不完整或格式不正确,缺少install.bat/install.exe
    rd /s /q "!TEMPDIR!" 1>nul 2>nul
    ren "!MODULE!" "%~nx1.end" 1>nul 2>nul
    set /a FAIL_COUNT+=1
    goto :eof
)

:: 执行安装
echo %info% 正在安装...
pushd "!TEMPDIR!"
if /i "!INSTALLER:~-4!"==".bat" (
    call "!INSTALLER!"
) else (
    "!INSTALLER!"
)
set "EXITCODE=!errorlevel!"
popd

pushd "%cd%\mod"
:: 处理安装结果
if !EXITCODE! equ 0 (
    if exist "!MODID!" (
        if exist "!MODID!_old" (
            rd /s /q "!MODID!_old"
        )
        ren "!MODID!" "!MODID!_old"
    )
    echo %SUCCESS% 模块安装完成！
) else (
    echo %error% 安装出错，错误码 !EXITCODE!
    rd /s /q "!TEMPDIR!" 1>nul 2>nul
    set /a FAIL_COUNT+=1
    popd
    goto :eof
)
ren "!TEMPDIR!" "!MODID!"
popd
ren "!MODULE!" "%~nx1.end" 1>nul 2>nul
set /a SUCCESS_COUNT+=1
goto :eof


:GetModId
:: 参数 %1 = atbmod.prop 文件路径
:: 输出 MODID 变量
set "PROP_FILE=%~1"
set "MODID="
set "MODNAME="
set "MODVERSION="
set "MODVERSIONCODE="
set "MODTYPE="
for /f "usebackq tokens=1,* delims==" %%a in ("!PROP_FILE!") do (
    if /i "%%a"=="modid" (
        set "MODID=%%b"
    )
)

for /f "usebackq tokens=1,* delims==" %%a in ("!PROP_FILE!") do (
    if /i "%%a"=="modname" (
        set "MODNAME=%%b"
    )
)

for /f "usebackq tokens=1,* delims==" %%a in ("!PROP_FILE!") do (
    if /i "%%a"=="modversion" (
        set "MODVERSION=%%b"
    )
)

for /f "usebackq tokens=1,* delims==" %%a in ("!PROP_FILE!") do (
    if /i "%%a"=="modversioncode" (
        set "MODVERSIONCODE=%%b"
    )
)
for /f "usebackq tokens=1,* delims==" %%a in ("!PROP_FILE!") do (
    if /i "%%a"=="modtype" (
        set "MODTYPE=%%b"
    )
)
