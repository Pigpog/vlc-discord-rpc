#!/bin/bash
pause() {
    read -p "Press any key to exit . . ."
    exit
}

if ! [ -d "node_modules" ]; then
    npm i --silent --production
    result=$?
    if [ $result -eq 127 ]; then
        echo ---------------------------------------------
        echo "           Please install npm."
        echo ---------------------------------------------
        pause
    elif ! [ $result -eq 0 ]; then
        echo ---------------------------------------------
        echo " An error occurred while installing modules."
        echo ---------------------------------------------
        pause
    fi
fi

npm start