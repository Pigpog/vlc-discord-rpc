/**
 * Starting point for
 * vlc-discord-rpc
 */
const { spawn } = require("child_process");
const config = require("../config/config.json");
const RPC = require("./rpc/client.js");

if (process.argv.includes("withvlc")) {
	var command = config.startupCommands[process.platform] || "vlc";
	var child = spawn(command, []);
	child.on("exit", () => {
		process.exit(0);
	});	
}
