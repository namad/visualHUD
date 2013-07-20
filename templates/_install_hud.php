::@echo off
set output=%userprofile%\AppData\LocalLow\id Software\quakelive\home\baseq3
if not exist "%output%" set output=%appdata%\id software\quakelive\home\baseq3
if not exist "%output%" goto end

set config_string="seta cg_hudFiles ui/<?= $config_name ?>.cfg"
if not exist "%output%\ui\" md "%output%\ui\"
if not exist "%output%\autoexec.cfg" echo.>"%output%\autoexec.cfg"

find /I /C %config_string% "%output%\autoexec.cfg"

if %ERRORLEVEL% EQU 0 (
    @echo Success
) else (
    echo seta cg_hudFiles ui/<?= $config_name ?>.cfg >> "%output%\autoexec.cfg"
)

XCOPY ".\<?= $config_name ?>.menu" "%output%\ui" /E /S /I
XCOPY ".\<?= $config_name ?>.cfg" "%output%\ui" /E /S /I
:end