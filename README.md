# vlc-discord-rpc
Discord rich presence for VLC media player.

![Example](https://raw.githubusercontent.com/Pigpog/vlc-discord-rpc/master/example.PNG)


### Requirements

- [NodeJS and NPM](https://nodejs.org/en/)
- Discord desktop client (not the website)
- Git

### Setup

#### VLC
You will need to enable the VLC web interface. To do this, go to the Preferences menu (under Tools) and select `All` under `Show settings` in the bottom left. Scroll to Interface and click on Main interfaces. Check the Web interface to enable it. Now expand the Main interfaces category and choose Lua. Set the password under `Lua HTTP`.

#### Edit config.js
Enter your VLC web interface password
`exports.vlcPass="your password here"`

#### Run the command `npm install --silent` in the project directory.

#### Restart VLC and run the command `node rpc.js` in the project directory

### Enjoy

#### TO MAKE ALL IN ONE SHORTCUT (new update):
The new update allows you to launch vlc with the rpc script. This can be made into a shortcut. The command needed to do so is
```
node "path/to/rpc.js" withvlc
```
On windows, create a new shortcut with that as the file location/target (replacing the path/to/ part with the actual file path). You can then set the icon to the vlc cone if you want by going into shortcut properties and hitting change icon.
If you're on linux you probably know how to create shortcuts on your DE and it should be the same idea.

**PLEASE NOTE** To launch VLC the script needs to know where VLC is. The config.js file contains what I think to be the defaults for each system. You may need to modify this.
