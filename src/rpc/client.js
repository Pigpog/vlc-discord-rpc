const RPC = require("discord-rpc");
const config = require("../../config/config.json");
const diff = require("../vlc/diff.js");
const format = require("./format.js");
const client = new RPC.Client({ transport: "ipc" });
const logger = require("../helpers/logger.js");
const log = logger("RPCClient", "BLUE");
var awake = true;
var timeInactive = 0;


client.login({ clientId: config.rpc.id })
	.then(() => {
		log("Ready.");
		setInterval(update, config.rpc.updateInterval);
	})
	.catch(err => {
		log("Error, " + err.message);
	});

// {Function} update
// Responsible for updating the
// user's presence. Everything
// happens here
function update() {
	diff((status, difference) => {
		if (difference) {
			log("Change detected");
			client.setActivity(format(status));
			if (!awake) {
				log("VLC started; waking up.");
				awake = true;
				client.setActivity(format(status));
				timeInactive = 0;
			}
		} else {
			if (awake) {
				if (status.state !== "playing") {
					if (timeInactive > config.rpc.sleepTime) {
						log("VLC not playing; going to sleep.");
						awake = false;
						client.clearActivity();
					}
					timeInactive += config.rpc.updateInterval;
				}
			}
		}
	});
}
