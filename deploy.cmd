@echo off
REM Gera o index.html e publica no GitHub Pages.
REM
REM Uso:  deploy.cmd                          mensagem automatica
REM       deploy.cmd "Atualiza comparativo"   mensagem propria
REM       deploy.cmd -Force                   sem pedir confirmacao
REM
REM Pode ser rodado por duplo clique no Explorer ou pelo terminal.

setlocal

REM Detecta duplo clique: nesse caso o cmd.exe foi chamado com /c e a janela
REM fecharia sozinha no fim, escondendo o resultado. Ai a gente segura com pause.
set DOUBLECLICK=
echo %CMDCMDLINE% | find /i " /c " >nul && set DOUBLECLICK=1

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy.ps1" %*
set RC=%ERRORLEVEL%

if defined DOUBLECLICK (
  echo.
  pause
)

exit /b %RC%
