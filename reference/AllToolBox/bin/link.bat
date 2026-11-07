
setlocal

set "shortname=%~1"
set "varname=%~2"
set /p head1=<settings\link.txt
:: set /p head2=<settings\link2.txt

set "apks=apks.zip"
set "Q1Y=DI01.zip"
set "Q2=DI02.zip"
set "Z2=I12.zip"
set "Z5=I13.zip"
set "Z5A=I13C.zip"
set "Z1=I16.zip"
set "Z1S=I17.zip"
set "Q1S=I17D.zip"
set "Z6=I18.zip"
set "Z5Pro=I19.zip"
set "Z6dfb=I20.zip"
set "Z7=I25.zip"
set "Z7A=I25C.zip"
set "Z7S=I25D.zip"
set "Z8=I32.zip"
set "Z3=IB.zip"
set "Z9=ND01.zip"
set "Z10=ND03.zip"
set "Z8A=ND07.zip"
set "Z11=ND08.zip"
set "D3=I28.zip"
set "flash_tool=flash_tool.zip"
set "drivers=drivers.zip"
set "rootproapks=rootproapks.zip"
set "systemui=systemui.zip"
set "twrp=twrp.zip"
set "userdata=userdata.img"
set "xp=xp.zip"
set "xtcpatch=xtcpatch.zip"
set "bin=bin.zip"
set "update=update.zip"
set "versiontmp=versiontmp.txt"
set "versionnotice=versionnotice.txt"
set "notice=notice.txt"
set "resversion=resversion.txt"
if "%~1"=="head" endlocal & set "head1=%head1%" & exit /b
set "filename=!%shortname%!"
if not defined filename (
    echo %error%´íÎó£º"%shortname%" Î´¶¨Òå
    endlocal
    exit /b 1
)
set "full_url=%head1%%filename%"

:: if "%filename%"=="notice.txt" set "full_url=%head1%%filename%"
:: if "%filename%"=="versiontmp.txt" set "full_url=%head1%%filename%"
:: if "%filename%"=="versionnotice.txt" set "full_url=%head1%%filename%"
:: if "%filename%"=="resversion.txt" set "full_url=%head1%%filename%"

endlocal & set "%varname%=%full_url%" & set "head=%head%"