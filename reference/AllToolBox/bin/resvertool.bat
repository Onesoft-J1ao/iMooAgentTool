

if /i "%~1"=="read" goto :read
if /i "%~1"=="set" goto :set
exit /b

:read
set "version=0"
if "%~2"=="" exit /b 1
set "target=%~2"
for /f "usebackq tokens=1,2 delims==" %%a in ("settings\resversion.txt") do (
    if "%%a"=="%target%" set "version=%%b"
)
for /f "usebackq tokens=1,2 delims==" %%a in ("resversion.txt") do (
    if "%%a"=="%target%" set "versiontmp=%%b"
)

if %versiontmp% GTR %version% (
    exit /b 1
) else (
    exit /b 0
)

:set


if "%~3"=="" (
    set "cloud_file=%cd%\resversion.txt"
    if not exist "!cloud_file!" (

        exit /b 1
    )
    set "key=%~2"
    set "value="
    for /f "usebackq tokens=1,* delims==" %%a in ("!cloud_file!") do (
        if "%%a"=="!key!" set "value=%%b"
    )
    if "!value!"=="" (

        exit /b 1
    )
) else (
    if "%~2"=="" exit /b 1
    set "key=%~2"
    set "value=%~3"
)

set "file=%cd%\settings\resversion.txt"
set "tempfile=!file!.tmp"
set "found="

if not exist "!file!" (
    echo !key!=!value!>"!file!"
    exit /b 0
)
> "!tempfile!" (
    for /f "usebackq tokens=1,* delims==" %%a in ("!file!") do (
        if "%%a"=="!key!" (
            echo !key!=!value!
            set found=1
        ) else (
            echo %%a=%%b
        )
    )
    if not defined found echo !key!=!value!
)
move /y "!tempfile!" "!file!" >nul
exit /b 0