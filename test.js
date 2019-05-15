const config=require("./config.json");
var client = require('discord-rich-presence')(config.discordAppID);	// Log into discord rich presence
var vlcService = require("droopy-vlc"),
    vlc = new vlcService("http://:"+encodeURIComponent(config.vlc.password)+"@"+config.vlc.host+":"+config.vlc.port);

console.log("Testing VLC and Discord");

client.once('connected', () => {
    console.log('Successfully connected to Discord');
})

client.once('error', (e) => {
    console.log("Failed to connect to Discord.");
})

vlc.togglePause().then(function(status) {
    console.log("Successfully contacted VLC Media Player");
    vlc.togglePause()
}, function (error){
    console.log("Failed to contact VLC Media Player. Check your config file.");
});