# vlc-discord-rpc
Discord rich presence for VLC media player.

![Example](https://raw.githubusercontent.com/Pigpog/vlc-discord-rpc/master/example.PNG)


### Requirements

- [NodeJS and NPM](https://nodejs.org/en/)
- Discord desktop client (not the website)
- Git

# Setup

#### This repository:

- Clone this repository: `git clone https://github.com/Pigpog/vlc-discord-rpc.git`

- Run the command `npm install --silent` in the cloned directory.

#### In VLC:
- Enable the VLC web interface.

To do this, go to the Preferences menu (under Tools) and select `All` under `Show settings` in the bottom left. Scroll to Interface and click on Main interfaces. Check the Web interface to enable it. Keep the settings open for the next step

- Set a password:

Expand the Main interfaces category and choose Lua. Set the password under `Lua HTTP`.

- Restart VLC for the changes to take effect

#### Configuration:

- Ensure that the `config.json` file is accurate, and contains your new password:
```
"vlc":{
    "password":"your password here",
```



#### Start the rich presence

- Start the rich presence script by running the command `node rpc.js` in the project directory

# Automate it!

Using the command-line argument, `withvlc`, the rich presence can be made more convenient.

```
node "path/to/rpc.js" withvlc
```

This command will start VLC alongside the rich presence. When VLC is closed, the rich presence will also close.

#### On Linux systems that support it...
A .desktop file is included in this repository. 
This is the best experience, because it can be put on a desktop and the script runs in the background
- You will need to edit the `Exec` line with the *absolute* path to rpc.js.

#### Or...
Create a shell script that runs the command and detaches.

Example:
```
#!/usr/bin/bash
node rpc.js withvlc &
```

#### On Windows...
- Create a new shortcut to rpc.js
- Right-click the shortcut and open it's properties menu
- Edit the Target property, adding ` withvlc` to the end of it
- (optional) Change the icon of the shortcut

**PLEASE NOTE** To launch VLC, the script needs to know where VLC is. The config.js file contains what I think to be the defaults for most systems. You may need to modify this.
