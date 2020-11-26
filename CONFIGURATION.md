# Configuration
Out of the box, vlc-discord-rpc is configured to work with minimal ambiguity by configuring VLC, on launch, with command-line arguments. In most cases, it is unnecessary to manually reconfigure.

This file will explain what each configuration option in the [config/config.js](./config/config.js) file does.

## Startup Commands
The startup commands are only relevant when running in attached (default) mode. Vlc-discord-rpc will run the provided command to open VLC for you.

Please note that the assumed defaults for each operating system is stored in [src/app.js](./src/app.js). This value acts as an override, useful on systems where VLC was installed somewhere unusual.

```
vlcPath: "",
```

## rpc

### id
```
id: '410664151334256663'
```
The rich presence Application ID. This ID is specific to vlc-discord-rpc, and gives the rich presence its name ("VLC Media Player") and image assets (cone icon, playing icon, etc). Applications can be created on [this page](https://discord.com/developers/applications/me) for maximum customization.

### updateInterval
```
updateInterval: 5000
```
The number of milliseconds between queries to VLC for information about what is playing. Note that Discord only recieves updates if something changes. Also note that more frequent queries means more CPU usage.

Change this setting to your own preference I guess.

### sleepTime
```
sleepTime: 30000
```
When playback is paused, the number of milliseconds until the rich presence turns off ("sleeps"). The rich presence will come back when playback resumes. Note that whether or not to sleep is decided every updateInterval, which means that sleep will occur on sleepTime's nearest upper multiple of updateInterval.

### displayTrackNumber
Whether or not to display the album track number. Track numbers show up as "(# of #)" on the rich presence, and only when the metadata has both the track number and total number of tracks.
```
displayTrackNumber: true,
```
### displayTimeRemaining
Whether or not to display the remaining time of the media you are playing.
```
displayTimeRemaining: true,
```
### detached
Enable or disable detached mode.
```
detached: false, // Launch VLC seperately
```
## vlc
This section relates to how VLC is configured. In attached mode, VLC is launched with the parameters set here. In detached mode, these values must correspond to VLC's configuration.
### password
This is the password of VLC's web interface. In attached mode, this is the password that will be set on the VLC instance that opens. In detached mode, it needs to be set manually. If no password is specified here, a random one will be generated.

```
password: '',
```

### port
This must be the port that VLC's web interface is listening on. VLC's web interface uses a default port of 8080, and if that port cannot be bound, it will bind to 9090. So, in the event that you already have something running on port 8080 (eg. another web server), you will need to change this value.

```
port: 8080
```

### address
This must be the hostname that VLC's web interface is listening on. You will likely never need to change this, but if you do, you probably know why.

```
address: 'localhost',
```
