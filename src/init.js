const {
	discord,
	vlc
} = require('../config/config.json');
const client = require('./rpc-client.js');
const readline = require('readline');
//const rl = new readline({output:process.stdio, input:processs.stdio});

if(process.argv.includes("withvlc")){	//if you want vlc to open with this script
	const { spawn } = require('child_process');
	var command=(config.startupCommands[process.platform] || "vlc");	// Selects the appropriate command to start VLC
	var child = spawn(command, [])	//launch vlc
	child.on("exit", () => {
		process.exit(0);
    })
}

client(discord.appId)