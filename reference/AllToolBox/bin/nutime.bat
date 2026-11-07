
set "hour=%time:~0,2%"
set "minute=%time:~3,2%"
set "second=%time:~6,2%"
set "centi=%time:~9,2%"

if "%hour:~0,1%"==" " set "hour=0%hour:~1,1%"

:: 输出纯数字（时分秒毫秒）
set "nutime=%hour%%minute%%second%%centi%"