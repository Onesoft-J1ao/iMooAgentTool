::call number [文件/内容] [输出变量]


setlocal enabledelayedexpansion

set "file_path=%~1"

if exist .\%file_path% set /p input=<%file_path%
if not exist .\%file_path% set "input=%~1"

set "digits="

:: 遍历每个字符
for /l %%i in (0 1 1000) do (
    if "!input:~%%i,1!"=="" goto output
    set "ch=!input:~%%i,1!"
    if "!ch!" geq "0" if "!ch!" leq "9" set "digits=!digits!!ch!"
)
:output
ENDLOCAL & set "%2=%digits%"
goto :eof
