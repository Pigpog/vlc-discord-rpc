# Configuration
If you want to get a little more advanced all the configurations are done in 
[config.json](./config/config.json). All the tweaks for each program (VLC & Discord) are
in their own object.

## VLC
 - **address**: This should always be localhost or 127.0.0.1 to access your VLC via http.
 - **password**: Every VLC web interfaces MUST have a password so this is automatically gotten
 If something does wrong vlc-discord-rpc will prompt you for the password.
 - **port**: The port by default will be 8080, in any case you already have a webserver running
 on that port the port will be 9090.

## RPC
RPC (Remote Procedure Call) is used to update the user's presence. Here are all the 
configurations for interacting with it.
- **id**: This is an applications ID this allows the presence to have metadata such as
showing the VLC's logo and the pause/play icon.
- **updateInterval**: (Based on the milliseconds) This is how frequently the user's 
presence should be updated (this will increase resource usage).
- **sleepTime**: (Based on the milliseconds) After x amount of milliseconds of nothing
happening the communication will go-to sleep until VLC has changed.
