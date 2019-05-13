const {
    discord,
    vlc
} = require('../config/config.json');
const rich = require('discord-rich-presence');
const buildPresence=require("./helpers/buildPresence.js");
const vlcjs = require('vlc.js');
const VLCClient = new vlcjs.Client(vlc);

const meta = {
    "lastFileName": ""
}

function update(client) {
    VLCClient.getStatus()
    .then(status => {
        if (status.information.category.meta.filename != meta.lastFileName) {
            console.log("Changes detected.");
            client.updatePresence(buildPresence(status));
        }
        meta.lastFileName = status.information.category.meta.filename;
    })
    .catch(console.log);
}

module.exports = id => {
    const RPCClient = rich(id)
    .on('connected', () => {
        console.log("Connected");
        update(RPCClient);
        setInterval(update, discord.updateInterval, RPCClient);	//check for updates repeatedly
    });
};
