progress.exe aria2c.exe --conf-path=./settings/aria2c.conf %*
set "errorcode=%errorlevel%"
exit /b %errorcode%