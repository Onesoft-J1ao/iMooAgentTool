
:menu
call logo
ECHO %ORANGE%模块商店主菜单%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\modulestore.json
set /p MENU=<menutmp.txt
if "%MENU%"=="A" exit /b
if "%MENU%"=="a" exit /b
if "%MENU%"=="1" goto modulestore-list
if "%MENU%"=="2" goto modulestore-search
if "%MENU%"=="3" goto modulestore-other
if "%MENU%"=="4" goto modulestore-about
ECHO %ERROR%输入错误，请重新输入！%RESET%
timeout /t 2 >nul
goto menu

:modulestore-about
call logo
ECHO %ORANGE%关于模块商店%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\modulestore-about.json
set /p MENU=<menutmp.txt
if "%MENU%"=="A" exit /b
if "%MENU%"=="a" exit /b
if "%MENU%"=="1" cls & modapi update
if "%MENU%"=="2" cls & modapi donation
if "%MENU%"=="3" cls & modapi thank
pause.exe 返回
goto modulestore-about

:modulestore-other
call logo
ECHO %ORANGE%模块商店其他功能%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\modulestore-other.json
set /p MENU=<menutmp.txt
if "%MENU%"=="A" exit /b
if "%MENU%"=="a" exit /b
if "%MENU%"=="1" cls & modapi notice
if "%MENU%"=="2" cls & modapi help
if "%MENU%"=="3" cls & modapi rank
pause.exe 返回
goto modulestore-other

:modulestore-search
call logo
ECHO %ORANGE%搜索模块%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\modulestore-search.json
set /p MENU=<menutmp.txt
if "%MENU%"=="A" exit /b
if "%MENU%"=="a" exit /b
set "search_type=%MENU%"
:: 输入关键词
set "keyword="
echo.
set /p keyword="请输入搜索关键词："
if "!keyword!"=="" (
    echo %error%关键词不能为空！
    timeout /t 2 >nul
    goto modulestore-search
)

echo.
echo %info%正在搜索模块...
set "result_json=.\tmp\json\search_result_%random%.json"
set "cnt=0"

:: 先写入开头
> "%result_json%" echo { "options": [

:: 循环写入搜索到的每个模块
for /f "usebackq tokens=1,* delims=|" %%a in (`%MODAPI% search !search_type! !keyword! names`) do (
    set "id=%%a"
    set "name=%%b"
    set "name=!name:"=\"!"
    >> "%result_json%" echo   { "value": "!id!", "label": "!id! - !name!" },
    set /a cnt+=1
)

if !cnt! equ 0 (
    echo %red%未找到匹配的模块。
    del "%result_json%" 2>nul
    pause.exe 返回
    goto modulestore-search
)

:: 追加返回选项，并闭合 JSON
>> "%result_json%" echo   { "value": "RETURN", "label": "返回" }
>> "%result_json%" echo ] }

:SHOW_RESULT
menu.exe "%result_json%"
if exist menutmp.txt (
    set /p user_choice=<menutmp.txt
    del menutmp.txt
)

if /i "!user_choice!"=="RETURN" (
    del "%result_json%" 2>nul
    goto modulestore-search
)

set "mod_id=!user_choice!"
call :ShowDetail !mod_id!
goto SHOW_RESULT


:modulestore-list
call logo
ECHO %ORANGE%列出模块列表%RESET%
del /Q /F .\menutmp.txt >nul 2>nul
menu.exe .\menu\modulestore-list.json
set /p MENU=<menutmp.txt
if "%MENU%"=="A" exit /b
if "%MENU%"=="a" exit /b
set "CATEGORY=%MENU%"


::配置
set "PERPAGE=10"          REM 展示模块数量
set "ORDER=desc"          REM 排序：desc/asc/random
set "page=1"

:SHOW_LIST
call :BuildListPage
if errorlevel 1 goto menu

menu.exe "%MENU_JSON%"
if exist menutmp.txt (
    set /p user_choice=<menutmp.txt
    del menutmp.txt
)
del "%MENU_JSON%" 2>nul

if /i "!user_choice!"=="BACK" goto menu
if /i "!user_choice!"=="NEXT" (
    set /a page+=1
    goto SHOW_LIST
)
if /i "!user_choice!"=="PREV" (
    set /a page-=1
    if !page! lss 1 set page=1
    goto SHOW_LIST
)


set "mod_id=!user_choice!"
call :ShowDetail !mod_id!
goto SHOW_LIST

:: JSON
:BuildListPage
set "MENU_JSON=.\tmp\json\modmenu_list_%random%.json"
set "cnt=0"
set "have_next=0"

:: 写入开头
> "%MENU_JSON%" echo { "options": [

for /f "usebackq tokens=1,* delims=|" %%a in (`modapi.exe list %CATEGORY% %ORDER% %PERPAGE% %page% names`) do (
    set "id=%%a"
    set "name=%%b"
    set "name=!name:"=\"!"
    >> "%MENU_JSON%" echo   { "value": "!id!", "label": "!id! - !name!" },
    set /a cnt+=1
)

if !cnt! equ 0 (
    del "%MENU_JSON%" 2>nul
    if !page! gtr 1 (
        set /a page-=1
        echo %Yellow%已经是最后一页，返回第 !page! 页...
        goto BuildListPage
    ) else (
        echo %error%无法获取模块数据，请检查网络
        timeout /t 2 >nul
        exit /b 1
    )
)

if !cnt! equ %PERPAGE% set "have_next=1"

:: 追加特殊选项
if !have_next! equ 1 (
    >> "%MENU_JSON%" echo   { "value": "NEXT", "label": "下一页" },
)
if !page! gtr 1 (
    >> "%MENU_JSON%" echo   { "value": "PREV", "label": "上一页" },
)
>> "%MENU_JSON%" echo   { "value": "BACK", "label": "返回" }

:: 闭合 JSON
>> "%MENU_JSON%" echo ] }

exit /b 0

:: 模块详情
:ShowDetail
set "mod_id=%~1"
if "%mod_id%"=="" exit /b 1

set "mod_name="
set "mod_ver="
set "mod_author="
set "mod_models="
set "mod_link="

for /f "usebackq tokens=1,* delims=：" %%a in (`modapi.exe search id %mod_id% full`) do (
    if "%%a"=="模块名"   set "mod_name=%%b"
    if "%%a"=="版本号"   set "mod_ver=%%b"
    if "%%a"=="作者"     set "mod_author=%%b"
    if "%%a"=="支持型号" set "mod_models=%%b"
)


for /f "usebackq tokens=1,* delims=|" %%a in (`modapi.exe search id %mod_id% links`) do (
    set "mod_link=%%b"
)


echo.
echo ========== 模块详情 ==========
echo   名称：!mod_name!
echo   版本：!mod_ver!
echo   作者：!mod_author!
echo   型号：!mod_models!
echo ================================
echo.

:: JSON
set "detail_json=.\tmp\json\modmenu_detail_%random%.json"
(
echo { "options": [
echo   { "value": "INSTALL",  "label": "刷入该模块" },
echo   { "value": "DOWNLOAD", "label": "下载该模块" },
echo   { "value": "DBACK",    "label": "返回" }
echo ] }
) > "%detail_json%"

:: 选择
menu.exe "%detail_json%"
if exist menutmp.txt (
    set /p action=<menutmp.txt
    del menutmp.txt
)
del "%detail_json%" 2>nul

if /i "!action!"=="DBACK" exit /b 0

if /i "!action!"=="INSTALL" (
    call :Download
    echo %info%正在发起刷入任务...
    device_check.exe adb&&ECHO.
    call instmodule.bat ./Download/!filename! !instmod!
    if !errorlevel! equ 0 (
        echo %GREEN%刷入成功！%RESET%
        call :reboot
    ) else (
        echo %RED%刷入失败！%RESET%
    )
    pause.exe 返回
    exit /b 0
)

if /i "!action!"=="DOWNLOAD" call :Download

exit /b 0
:Download
if "!mod_link!"=="" (
    echo %error%请求下载链接失败
    timeout /t 2 >nul
    exit /b 0
)
:: 下载
set "filename=!mod_name!_!mod_ver!.zip"

set "filename=!filename:/=_!"
set "filename=!filename:\=_!"
echo 正在下载：!filename!
call curltool -o "./Download/!filename!" "!mod_link!" >nul 2>&1
if exist "!filename!" (
    echo %Green%下载完成：./Download/!filename!
) else (
    echo %error%下载失败，请检查网络和链接。
)
timeout /t 2 >nul
exit /b 0


