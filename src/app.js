/**
 * Starting point for
 * vlc-discord-rpc
 */
const config = require("../config/config.json");
const update = require("./presence/update.js");
const { spawn } = require("child_process");
const RPC = require("discord-rich-presence");
const RPCClient = RPC(config.rpc.id).on("connected", () => {
	console.log("Connected");
	update(RPCClient);
	setInterval(update, config.rpc.updateInterval, RPCClient); //check for updates repeatedly
});

if (process.argv.includes("withvlc")) {
	var command = config.startupCommands[process.platform] || "vlc";
	spawn(command, []).on("exit", () => {
		process.exit(0);
	});
}
