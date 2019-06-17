@echo off
if NOT EXIST node_modules (
    ECHO Did not detect node_modules directory; Installing modules...
    CALL npm i --production --silent
    if NOT EXIST node_modules (
        START CMD /C "ECHO A problem occurrred while installing modules. Ensure that npm is installed. && PAUSE"
        EXIT
    )
    ECHO Modules installed.
)
ECHO Starting script...
CALL npm start
IF %ERRORLEVEL% EQU 1 (
    START CMD /C "ECHO A problem occurrred while launching vlc. && PAUSE"
)