const {
    discord,
    vlc
} = require('../config/config.json');
const rich = require('discord-rich-presence');
const buildPresence=require("./helpers/buildPresence.js");
const vlcjs = require('vlc.js');
const VLCClient = new vlcjs.Client(vlc);
var timeInactive=0;
var loggedIn=false;

var meta = {
    "lastFileName": "",
    "lastState":""
}

function sleep(client){
    console.log("Sleeping");
    client.disconnect();
    loggedIn=false;
}

function wake(client){
    console.log("Waking");
    client=rich(discord.appId);
    loggedIn=true;
}

function update(client) {
    VLCClient.getStatus()
    .then(status => {
        if(status.state==="paused" || status.state==="stopped"){
            if(loggedIn){
                timeInactive+=discord.updateInterval;
                if(timeInactive>discord.sleepTime){
                    sleep(client);
                }
            }
        }else{
            timeInactive=0;
            if(!loggedIn){
                wake(client);
            }
        }
        if((status.information.category.meta.filename !== meta.lastFileName || status.state !== meta.lastState) && loggedIn) {
            
            console.log("Changes detected.");
            client.updatePresence(buildPresence(status));
        }
        meta.lastFileName = status.information.category.meta.filename;
        meta.lastState = status.state;
    })
    .catch(console.log);
}

module.exports = id => {
    const RPCClient = rich(id)
    .on('connected', () => {
        loggedIn=true;
        console.log("Connected");
        update(RPCClient);
        setInterval(update, discord.updateInterval, RPCClient);	//check for updates repeatedly
    });
};
