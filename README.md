# vlc-discord-rpc
Discord rich presence for VLC media player.

![Example](./example.png)

Join us on [Discord](https://discord.gg/3Fu6KHd).

## Requirements
- [NodeJS and NPM](https://nodejs.org/en/)
- [VLC](https://www.videolan.org/index.html)
- [Discord desktop client](https://discordapp.com/)

## Start
 1. [Download the latest release for your platform](https://github.com/Pigpog/vlc-discord-rpc/releases)
 2. Unzip the file
 3. Launch the start file.
 4. Play media in the VLC window that opens

If you installed VLC to a strange place, or you get the error "A problem occurred while launching vlc", you will need to edit the path of VLC in [config/config.js](./config/config.js).

## *Optional*
### Detached Mode (Best Experience)
Detached mode allows you to use VLC as normal.
#### Steps
 1. You must [configure the VLC web interface](https://github.com/azrafe7/vlc4youtube/blob/master/instructions/how-to-enable-vlc-web-interface.md) (follow the 'troubleshooting' steps as well, then restart VLC)
 2. Open config/config.js in a text editor and put your VLC web interface password here: `password: 'YOUR_VLC_PASSW_HERE'`. The single quotes are important.
 3. Modify config/config.js by changing the port to 8080 instead of 9090

To enable detached mode permanently, you can open config/config.js in a text editor and change `detached: false` to `detached: true`.

### Configuration
[config/config.js](./config/config.js) may need to be modified if:
 - Your system uses an abnormal VLC install
 - You have manually configured your VLC web interface

Please see [CONFIGURATION.md](./CONFIGURATION.md) to learn more about manual configuration.

### Limitations
 - When running multiple concurrent instances, only the first-opened instance of VLC will have a rich presence
 - The rich presence cannot display album art
