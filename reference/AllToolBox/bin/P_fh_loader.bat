del /q /f fh_error.txt >nul 2>nul
:run
fh_loader.exe %* || goto error
exit /b
:error
echo. > fh_error.txt
exit /b 1
