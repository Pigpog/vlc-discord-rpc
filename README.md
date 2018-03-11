# vlc-discord-rpc
Discord rich presence for VLC media player.

![Example](https://raw.githubusercontent.com/Pigpog/vlc-discord-rpc/master/example.PNG)


### Requirements

- [NodeJS and NPM](https://nodejs.org/en/)
- Discord desktop client (not the website)

### Setup

#### VLC
You will need to enable the VLC web interface. To do this, go to the Preferences menu (under Tools) and select `All` under `Show settings` in the bottom left. Scroll to Interface and click on Main interfaces. Check the Web interface to enable it. Now expand the Main interfaces category and choose Lua. Set the password under `Lua HTTP`.

#### Edit config.js
Enter your VLC web interface password
`exports.vlcPass="your password here"`

#### Run the command `npm install` in the project directory

#### Run the command `node rpc.js` in the project directory

### Enjoy
