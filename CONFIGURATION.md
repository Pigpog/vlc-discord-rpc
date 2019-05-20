# Manual Configuration Instructions
Out of the box, vlc-discord-rpc is configured to work with minimal ambiguity by configuring VLC, on launch, with command-line arguments. In most cases, it is unnecessary to manually reconfigure.

Here are some possible scenarios where you may need to modify [config.js](./config/config.js):
## Your system uses an abnormal VLC install
Depending on the location of your VLC binary, you may need to modify the [startup command](./config/config.js#L5) for your operating system.

This program needs to know where your VLC binary is installed so it can launch it (unless, of course, you are running in [detached mode](./README.md#run-detached)).

## You have manually configured your VLC web interface
You will need to modify the [VLC](./config/config.js#L16) password and port of config.js to match your VLC settings. By default, VLC uses port 8080.

`"password": ("YOUR PASSWD HERE" || randomPass()),`
## You want to run this rich presence client independent from VLC (Detached)
If vlc-discord-rpc is not launching VLC for you, it can't tell VLC which port or password to use.

You must [configure the VLC web interface](https://github.com/azrafe7/vlc4youtube/blob/master/instructions/how-to-enable-vlc-web-interface.md) (follow the 'troubleshooting' steps as well, then restart VLC) and modify config.js to match.
