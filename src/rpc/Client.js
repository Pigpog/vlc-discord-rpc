/**
 * Main RPC Client
 */
const config = require("../../config/config.json");
const { diff } = require("../vlc/");
const logger = require("../helpers/logger.js");
const format = require("./format-presence.js");
const RPC = require("discord-rich-presence");
const log = logger("RPCClient", "BLUE");
var awake = true;
var timeInactive = 0;

// Responsible for updating the
// user's presence. Everything
// happens here
function update(RPCClient) {
	diff((status, difference) => {
		if (difference) {
			log("Change detected");
			RPCClient.updatePresence(format(status));
		} else {
			if (
				status.state == "paused" ||
				status.state == "stopped"
			) {
				if (awake) {
					timeInactive +=
						config.rpc.updateInterval;
					if (
						timeInactive >
						config.rpc.sleepTime
					) {
						log(
							"VLC not playing; going to sleeping."
						);
						awake = false;
					}
				} else {
					log("VLC started; waking up.");
					awake = true;
				}
			}
		}
	});
}

module.exports = begin => {
	if (begin) {
		const RPCClient = RPC(config.rpc.id);
		RPCClient.on("connected", () => {
			log("Connected");
			setInterval(
				update,
				config.rpc.updateInterval,
				RPCClient
			);
		});
		RPCClient.on("error", err => {
			log("Error, " + err.message);
		});
	}
};
