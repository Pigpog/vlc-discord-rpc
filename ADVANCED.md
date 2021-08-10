# Advanced Configuration Options

## Detached Mode (Best Experience)

Out of the box, starting vlc-discord-rpc will open VLC, and closing VLC will close vlc-discord-rpc.
This is the "attached" mode, and it is the default because "it just works" in most cases.

Detached mode will not open VLC for you, and closing VLC won't close vlc-discord-rpc.
It requires a bit of tweaking, but once it is configured, it allows you to open and close VLC as
you normally would and still show a rich presence.

### Instructions

These instructions apply to all platforms. For a visual guide, see
[this GIF](https://github.com/Pigpog/vlc-discord-rpc/blob/develop/setup.gif?raw=true)

 1. Open VLC Media Player

 2. In the Tools drop-down menu, select Preferences to open the Preferences window.

 3. To the bottom left corner of the Preferences window, you'll see a box labeled "Show settings". Choose
"All" to reveal the advanced preferences.

 4. Type "Lua" into the search bar that appears in the top left, and click "Main interfaces" from the results.

 5. Enable the HTTP interface by checking the "Web" checkbox.

 6. Under "Main interfaces" in the left pane, click "Lua".

 7. Enter a fresh new password into the Password field under Lua HTTP.

 8. Click the Save button at the bottom of the window.

 9. Open the config/config.js file in a text editor

 10. Put the password you made earlier between the single-quotes of the `password: '',` line, and change `detached: false`
to `detached: true` to enable detached mode.

## Album Art and Custom Icons

It is possible to have album art show up on your rich presence, in place of the VLC cone icon.
Unfortunately, there is no way to have the art upload automatically, so you must manually
upload each album art to Discord before it can be used. It's not a difficult process, but it
does require some time and has limitations.

### Instructions

 1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.
You should name it "VLC Media Player", though it's up to you.

 2. In the left menu, click Rich Presence.

 3. Upload the "playing", "paused", "stopped", and "vlc" icons, and give them their respective names.
The default assets can be found [here](./icons/) and [here](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/VLC_Icon.svg/1809px-VLC_Icon.svg.png).

 4. Upload the album art you want to display, giving them sensible names for your own sake (eg. the album title with no spaces or special characters).

 5. Open the [config/art.json](./config/art.json) file in a text editor. Between the curly braces (`{ }`), put new lines for each of your albums, 
The format for each line should be:

```
    "Album Title Exactly How It's Displayed": "discordassetname",
```
Note that the comma at the end must not be there on the last line you add.

Heres a realistic example of a complete config/art.json file:

```
{
    "Thriller": "thriller",
    "Diamond Dogs": "diamonddogs",
    "Welcome to Sky Valley": "welcometoskyvalley",
    "Demon Days": "demondays"
}
```

6. Run vlc-discord-rpc, and you should see the album art when listening to albums you've added. If no image is shown, make sure the album name you put
is exactly how it displays in VLC, case sensitive.
