@echo off
if NOT EXIST node_modules (
    ECHO Did not detect node_modules directory; Installing modules...
    CALL npm i --production --silent
    if NOT EXIST node_modules (
        ECHO ---------------------------------------------------------------------------
        ECHO A problem occurrred while installing modules. Ensure that npm is installed.
        ECHO ---------------------------------------------------------------------------
        PAUSE
        EXIT
    )
    ECHO Modules installed.
)
ECHO Starting script...
CALL  npm start --silent
IF %ERRORLEVEL% EQU 1 (
    PAUSE
)