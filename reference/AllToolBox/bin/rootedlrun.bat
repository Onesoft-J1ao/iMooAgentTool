
call logo
echo %ORANGE%请选择需要root的型号%YELLOW%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\root.json
set /p MENU=<menutmp.txt
if "%MENU%"=="1" call :info "I12" "Z2" "25" "7.1.1"
if "%MENU%"=="2" call :info "IB" "Z3" "25" "7.1.1"
if "%MENU%"=="3" call :info "I13C" "Z5A" "25" "7.1.1"
if "%MENU%"=="4" call :info "I13" "Z5Q" "25" "7.1.1"
if "%MENU%"=="5" call :info "I19" "Z5PRO" "25" "7.1.1"
if "%MENU%"=="6" call :info "I18" "Z6" "25" "7.1.1"
if "%MENU%"=="14" call :info "ND03" "Z10" "30" "11"
if "%MENU%"=="15" call :info "ND08" "Z11" "30" "11"
goto continue
if "%MENU%"=="7" call :info "I20" "Z6DFB" "27" "8.1"
if "%MENU%"=="8" call :info "I25" "Z7" "27" "8.1"
if "%MENU%"=="9" call :info "I25C" "Z7A" "27" "8.1"
if "%MENU%"=="10" call :info "I25D" "Z7S" "27" "8.1"
if "%MENU%"=="11" call :info "I32" "Z8" "27" "8.1"
if "%MENU%"=="12" call :info "ND07" "Z8A" "27" "8.1"
if "%MENU%"=="13" call :info "ND01" "Z9" "27" "8.1"
echo %ORANGE%请选择是否是V3版本%YELLOW%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\isv3.json
set /p isv3=<menutmp.txt
del /Q /F .\isv3.txt >nul 2>nul
set /p="%isv3%" <nul > isv3.txt

:continue
echo %INFO%信息填写完成，准备继续...
echo %INFO%等待9008设备连接...
device_check.exe qcom_edl&&ECHO.

:info
set "innermodel=%~1"
set "model=%~2"
set "sdkversion=%~3"
set "androidversion=%~4"
set "version=null"
goto :eof