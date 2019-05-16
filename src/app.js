/**
 * Starting point for
 * vlc-discord-rpc
 */
const { spawn } = require("child_process");
const config = require("../config/config.json");
const RPC = require("./rpc/client.js");
const logger = require("./helpers/logger.js");
const log = logger("VLC", "YELLOW");

if (process.argv.includes("withvlc")) {
	var command = config.startupCommands[process.platform] || "vlc";
	var child = spawn(command, []);
	child.on("exit", () => {
		process.exit(0);
	});	
}
