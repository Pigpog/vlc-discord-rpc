# vlc-discord-rpc
Discord rich presence for VLC media player.

![Example](./example.png)

Join us on [Discord](https://discord.gg/3Fu6KHd).

## Requirements
- [NodeJS](https://nodejs.org/en/)
- [VLC](https://www.videolan.org/index.html)
- [Discord desktop client](https://discordapp.com/)
- [vlc-discord-rpc](https://github.com/Pigpog/vlc-discord-rpc/releases)

## Setup
Open VLC go-to preferences (`CTRL-P`) show all settings (bottom left) and search for 
"lua http". You should see "Main Interfaces" there you must check mark the "Web" interface.
Then go-to Lua which is under "Main Interfaces" and set a password (this is required), and 
then relaunch VLC. See [setup.gif](./setup.gif) for a visual guide.

### Windows
Unzip vlc-discord-rpc.zip open the scripts folder and run `setup.bat`. Finally to start
the program make sure Discord & VLC are open run `start.bat` to begin.

### MacOS & Linux
Unzip vlc-discord-rpc.zip open the scripts folder and run `setup.sh`. Finally to start
the program make sure Discord & VLC are open run `start.sh` to begin.
