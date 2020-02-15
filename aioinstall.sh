#!/bin/bash

dependencies='git luarocks make cmake'
libdependencies='libdiscord-rpc.so'
repositories='
 https://github.com/Pigpog/discord-rich-presence-cli
 https://github.com/mah0x211/lua-process
'

depfailexit () {
    printf "FAIL\n"
    printf "\n\nERROR: Missing dependency $1. No changes have been made.\n"
    exit 1
}

repofailexit () {
    printf "FAIL\n"
    printf "\n\nERROR: Failed to clone repository:\n$1"
    exit 1
}

compilefailexit () {
    printf "\nERROR: Failed to compile $1\n"
    exit 1
}

printf "Checking for build dependencies\n"
for dependency in $dependencies
do
    printf "  $dependency ...... "
    $dependency --version &> /dev/null
    if [ $? == 0 ] 
    then
        printf "OK\n"
    else
        depfailexit $dependency
    fi
done

printf "\nChecking for library dependencies\n"
for dependency in $libdependencies
do
    printf "  $dependency ...... "
    ldconfig -p | grep $dependency &> /dev/null
    if [ $? == 0 ] 
    then
        printf "OK\n"
    else
        depfailexit $dependency
    fi
done

printf "\nChecking for repositories\n"
for repository in $repositories
do
    printf "  ${repository##*/} ...... "
    if [ -d "${repository##*/}" ]
    then
        printf "OK\n"
    else
        printf "NO\n"
        printf "Cloning $repository\n"
        git clone --quiet --recurse-submodules $repository
        if [ $? == 0 ] 
        then
            printf "OK\n"
        else
            echo $?
            repofailexit $repository
        fi
    fi
done

printf "\nAll dependencies are in order."
printf "\n\nCopying Makefile to lua-process\n"

cp --remove-destination ./lua-processMakefile lua-process/Makefile

printf "Starting build lua-process.\n"

cd lua-process

luarocks make --local

if [ $? != 0 ]
then
    compilefailexit "lua-process"
fi

printf "\nSuccessfully built and installed lua-process\n"

printf "\nStarting build discord-rich-presence-cli\n"

cd ../discord-rich-presence-cli

printf "\nStarting CMake\n"
cmake .
if [ $? != 0 ]
then
    compilefailexit "discord-rich-presence-cli"
fi

printf "\nStarting Make\n"
make
if [ $? != 0 ]
then
    compilefailexit "discord-rich-presence-cli"
fi

printf "\nSuccessfully built discord-rich-presence-cli.\n"

printf "\nConfirming directory structure\n"

if [ -d "$HOME/.local/share/vlc/" ]
    then
        printf "OK\n"
    else
        printf "\nERROR: Did not detect folder $HOME/.local/share/vlc/.\n"
        exit 1
fi

mkdir -p ~/.local/share/vlc/lua/extensions/modules
cp send-presence ~/.local/share/vlc/lua/extensions/modules
cd ..
cp discordrichpresence.lua ~/.local/share/vlc/lua/extensions/