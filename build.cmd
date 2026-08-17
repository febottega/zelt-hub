@echo off
REM Wrapper para rodar o build sem depender da ExecutionPolicy do Windows.
REM Uso:  build.cmd            -> gera index.html
REM       build.cmd -OutFile x -> gera em outro caminho (para conferir)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build.ps1" %*
exit /b %ERRORLEVEL%
