# vlc-discord-rpc (Lua version!) (Linux only! (for now))
This is an exciting update to the vlc-discord-rpc project. This is the very first time i'm sharing this code, so don't be suprised if it doesn't immediately work on your system. Almost all of the steps below will be unneeded when I start creating releases. There are components that are currently configured to only work on Linux.

## Requirements / Setup:
These
### discord-rpc
 - Download the latest Linux release: [discord-rpc](https://github.com/discordapp/discord-rpc/releases)
 - Put the files from `linux-dynamic/lib` in `/usr/lib`, and `linux-dynamic/include` in `/usr/include`.
### Lua-Rocks
Lua-Rocks is required for compiling a dependency of this project. Find it in your package manager.
### Lua-Process
This is a Lua module for creating and dealing with child processes. You must clone it from here: [lua-process](https://github.com/mah0x211/lua-process/), then clone [its dependency](https://github.com/mah0x211/lauxhlib/) to `deps/`. Then, compile lua-process using the [Makefile](./Makefile) from this repository.
### Discord-Rich-Presence-Cli
This is a very simple program I made based on the examples from discord-rpc. It acts as the 'glue' between discord-rpc and this repo's lua script. All it does is prompt for Rich Presence data and then send that off to Discord.

Clone this repository: [discord-rich-presence-cli](https://github.com/Pigpog/discord-rich-presence-cli), then open it in a terminal and run:
```
cmake .
make
```


## Final Steps:
### Install the vlc extension
Copy the discordrichpresence.lua file to `~/.local/share/vlc/lua/extensions/`.
```
cp discordrichpresence.lua ~/.local/share/vlc/lua/extensions/
```
If the extensions directory does not exist, create it. If the vlc directory does not exist, do you have vlc installed?

### Copy the extension's dependencies
Copy the `process.so` we compiled from lua-process to `~/.local/share/vlc/lua/extensions/modules`

Copy the `send-presence` binary we compiled from discord-rich-presence-cli to the same directory as process.so.

### Ready to run!
Open VLC media player. The extension should be listed as an option in the View menu of VLC. Play a song, and tick the box. See what happens!

## Gosh, that was a lot of work.
 - Have a healthy snack.
