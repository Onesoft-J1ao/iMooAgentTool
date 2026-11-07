
if not "%1"=="" goto %1

cls
del /Q /F .\menutmp.txt >nul 2>nul
echo %info%提示:工具箱启动后还能进入本页面，未下载的资源，在需要用到时会自动下载
echo %ORANGE%请选择需要下载的资源%YELLOW%
set menu=exit
menu.exe -s .\menu\cloud.json
set /p menu=<menutmp.txt
if "%menu%"=="exit" goto exit
if "%menu%"=="" goto exit
call link resversion url
call curltool.bat %url% 2>nul >nul
if %errorlevel% neq 0 (
   echo %ERROR%检查资源更新时出错，错误值:%errorlevel%
   exit /b
)
for %%i in (%menu%) do (
    if %%i==1 (
        call :toolbox
    ) else if %%i==2 (
        call :twrp
    ) else if %%i==3 (
        call :xp
    ) else if %%i==4 (
        call :rootproapks
    ) else if %%i==5 (
        call :drivers
    ) else if %%i==6 (
        call :Q1S
    ) else if %%i==7 (
        call :Q1Y
    ) else if %%i==8 (
        call :Q2
    ) else if %%i==9 (
        call :Z1
    ) else if %%i==10 (
        call :Z1S
    ) else if %%i==11 (
        call :Z2
    ) else if %%i==12 (
        call :Z3
    ) else if %%i==13 (
        call :Z5
    ) else if %%i==14 (
        call :Z5A
    ) else if %%i==15 (
        call :Z5Pro
    ) else if %%i==16 (
        call :Z6
    ) else if %%i==17 (
        call :Z6dfb
    ) else if %%i==18 (
        call :Z7
    ) else if %%i==19 (
        call :Z7A
    ) else if %%i==20 (
        call :Z7S
    ) else if %%i==21 (
        call :Z8
    ) else if %%i==22 (
        call :Z8A
    ) else if %%i==23 (
        call :Z9
    ) else if %%i==24 (
        call :Z10
    ) else if %%i==25 (
        call :Z11
    ) else if %%i==26 (
        call :D3
    )
)
:exit
echo %green%操作全部完成。
pause.exe 继续
exit /b

:toolbox
echo %info%正在下载工具箱root组件（包含 userdata, apks, systemui, xtcpatch）
call :userdata
call :apks
call :xtcpatch
call :systemui
echo %green%工具箱root组件全部准备完成!%RESET%
exit /b

:userdata
call link userdata url
echo %info%正在下载userdata
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\userdata.img .\tmp\userdata.img
call resvertool set userdata.img
echo %green%userdata 下载完成!%RESET%
exit /b

:apks
call link apks url
echo %info%正在下载apks
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
echo %green%下载完成
echo %info%正在解压
progress.exe 7z x apks.zip -aoa -bsp1
if %errorlevel% neq 0 (
ECHO %ERROR%解压文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
del /Q /F .\apks.zip >nul 2>nul
call resvertool set apks.zip
echo %green%apks 准备完成!%RESET%
exit /b

:systemui
:: if exist .\settings\test.txt (
    :: echo %error%你正在使用测试文件,无法与云端同步
    :: pause.exe 继续
    :: exit /b
:: )
call link systemui url
echo %info%正在下载systemui
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\systemui.zip .\tmp\systemui.zip
call resvertool set systemui.zip
echo %green%systemui下载完成
exit /b

:xtcpatch
:: if exist .\settings\test.txt (
    :: echo %error%你正在使用测试文件,无法与云端同步
    :: pause.exe 继续
    :: exit /b
:: )
call link xtcpatch url
echo %info%正在下载xtcpatch
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\xtcpatch.zip .\tmp\xtcpatch.zip
call resvertool set xtcpatch.zip
echo %green%xtcpatch下载完成
exit /b

:twrp
call link twrp url
echo %info%正在下载twrp资源
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
echo %green%下载完成
echo %info%正在解压
progress.exe 7z x twrp.zip -o.\EDL -aoa -bsp1
if %errorlevel% neq 0 (
ECHO %ERROR%解压文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
del /Q /F .\twrp.zip >nul 2>nul
call resvertool set twrp.zip
echo %green%twrp 准备完成!%RESET%
exit /b

:xp
call link xp url
echo %info%正在下载xp框架
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
echo %green%下载完成
echo %info%正在解压
progress.exe 7z x xp.zip -aoa -bsp1
if %errorlevel% neq 0 (
ECHO %ERROR%解压文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
del /Q /F .\xp.zip >nul 2>nul
call resvertool set xp.zip
echo %green%xp框架 准备完成!%RESET%
exit /b

:rootproapks
call link rootproapks url
echo %info%正在下载附加apks
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
echo %green%下载完成
echo %info%正在解压
progress.exe 7z x rootproapks.zip -aoa -bsp1
if %errorlevel% neq 0 (
ECHO %ERROR%解压文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
del /Q /F .\rootproapks.zip >nul 2>nul
call resvertool set rootproapks.zip
echo %green%附加apks 准备完成!%RESET%
exit /b

:drivers
call link drivers url
echo %info%正在下载drivers
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
echo %green%下载完成
echo %info%正在解压
progress.exe 7z x drivers.zip -aoa -bsp1
if %errorlevel% neq 0 (
ECHO %ERROR%解压文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
del /Q /F .\drivers.zip >nul 2>nul
call resvertool set drivers.zip
echo %green%drivers 准备完成!%RESET%
exit /b

:Q1S
call link Q1S url
echo %info%正在下载Q1S
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\I17D.zip .\EDL\I17D.zip
call resvertool set I17D.zip
echo %green%Q1S下载完成
exit /b

:Q1Y
call link Q1Y url
echo %info%正在下载Q1Y
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\DI01.zip .\EDL\DI01.zip
call resvertool set DI01.zip
echo %green%Q1Y下载完成
exit /b

:Q2
call link Q2 url
echo %info%正在下载Q2
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\DI02.zip .\EDL\DI02.zip
call resvertool set DI02.zip
echo %green%Q2下载完成
exit /b

:Z1
call link Z1 url
echo %info%正在下载Z1
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\I16.zip .\EDL\I16.zip
call resvertool set I16.zip
echo %green%Z1下载完成
exit /b

:Z1S
call link Z1S url
echo %info%正在下载Z1S
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\I17.zip .\EDL\I17.zip
call resvertool set I17.zip
echo %green%Z1S下载完成
exit /b

:Z2
call link Z2 url
echo %info%正在下载Z2
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\I12.zip .\EDL\I12.zip
call resvertool set I12.zip
echo %green%Z2下载完成
exit /b

:Z3
call link Z3 url
echo %info%正在下载Z3
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\IB.zip .\EDL\IB.zip
call resvertool set IB.zip
echo %green%Z3下载完成
exit /b

:Z5
call link Z5 url
echo %info%正在下载Z5
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\I13.zip .\EDL\I13.zip
call resvertool set I13.zip
echo %green%Z5下载完成
exit /b

:Z5A
call link Z5A url
echo %info%正在下载Z5A
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\I13C.zip .\EDL\I13C.zip
call resvertool set I13C.zip
echo %green%Z5A下载完成
exit /b

:Z5Pro
call link Z5Pro url
echo %info%正在下载Z5Pro
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\I19.zip .\EDL\I19.zip
call resvertool set I19.zip
echo %green%Z5Pro下载完成
exit /b

:Z6
call link Z6 url
echo %info%正在下载Z6
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\I18.zip .\EDL\I18.zip
call resvertool set I18.zip
echo %green%Z6下载完成
exit /b

:Z6dfb
call link Z6dfb url
echo %info%正在下载Z6dfb
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\I20.zip .\EDL\I20.zip
call resvertool set I20.zip
echo %green%Z6dfb下载完成
exit /b

:Z7
call link Z7 url
echo %info%正在下载Z7
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\I25.zip .\EDL\I25.zip
call resvertool set I25.zip
echo %green%Z7下载完成
exit /b

:Z7A
call link Z7A url
echo %info%正在下载Z7A
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\I25C.zip .\EDL\I25C.zip
call resvertool set I25C.zip
echo %green%Z7A下载完成
exit /b

:Z7S
call link Z7S url
echo %info%正在下载Z7S
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\I25D.zip .\EDL\I25D.zip
call resvertool set I25D.zip
echo %green%Z7S下载完成
exit /b

:Z8
call link Z8 url
echo %info%正在下载Z8
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\I32.zip .\EDL\I32.zip
call resvertool set I32.zip
echo %green%Z8下载完成
exit /b

:Z8A
call link Z8A url
echo %info%正在下载Z8A
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\ND07.zip .\EDL\ND07.zip
call resvertool set ND07.zip
echo %green%Z8A下载完成
exit /b

:Z9
call link Z9 url
echo %info%正在下载Z9
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\ND01.zip .\EDL\ND01.zip
call resvertool set ND01.zip
echo %green%Z9下载完成
exit /b

:Z10
call link Z10 url
echo %info%正在下载Z10
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\ND03.zip .\EDL\ND03.zip
call resvertool set ND03.zip
echo %green%Z10下载完成
exit /b

:bin
call link bin url
echo %info%正在下载bin
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)

echo %green%bin 准备完成!%RESET%
exit /b

:flash_tool
call link flash_tool url
echo %info%正在下载flash_tool
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
echo %green%下载完成
echo %info%正在解压
progress.exe 7z x flash_tool.zip -aoa -bsp1
if %errorlevel% neq 0 (
ECHO %ERROR%解压文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
del /Q /F .\flash_tool.zip >nul 2>nul
echo %green%flash_tool 准备完成!%RESET%
exit /b

:innermodel
call link head
echo %info%正在下载
call curltool.bat %head1%%innermodel%.zip
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\%innermodel%.zip .\EDL\%innermodel%.zip
call resvertool set %innermodel%.zip
echo %green%下载完成
exit /b

:Z11
call link Z11 url
echo %info%正在下载Z11
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\ND08.zip .\EDL\ND08.zip
call resvertool set ND08.zip
echo %green%Z11下载完成
exit /b

:D3
call link D3 url
echo %info%正在下载D3
call curltool.bat %url%
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\I28.zip .\EDL\I28.zip
call resvertool set I28.zip
echo %green%D3下载完成
exit /b

:ota
call link head
echo %info%正在下载
call curltool.bat %head1%ota/%innermodel%.zip
if %errorlevel% neq 0 (
ECHO %ERROR%下载文件时出现错误，错误值:%errorlevel%
pause.exe 返回
exit /b
)
move /Y .\%innermodel%.zip .\OTA\%innermodel%.zip
echo %green%下载完成
exit /b


:: :offline
:: echo %info%必须放置以下文件到工具箱内
:: type cloud_toolbox.txt
:: echo.
:: echo %info%可选放置以下文件到工具箱内
:: type cloud_other.txt
:: echo.