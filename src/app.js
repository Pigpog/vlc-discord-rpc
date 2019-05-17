/**
 * Starting point for
 * vlc-discord-rpc
 */
const { spawn } = require("child_process");
const config = require("../config/config.js");
const RPC = require("./rpc/client.js");
const log = require("./helpers/logger.js")("App")


if (!process.argv.includes("detached")) {
	var command = config.startupCommands[process.platform] || "vlc";
	// HACK: set config.vlc.address to your friends VLC hostname
	// in the config to display their songs on your presence.
	var child = spawn(command, ["--extraintf", "http", "--http-host", config.vlc.address, "--http-password", config.vlc.password, "--http-port", config.vlc.port]);
	child.on("exit", () => {
		log("VLC closed, closing.", true);
		process.exit(0);
	});
	child.on("error", (e)=>{
		process.exit(0)
	})
}