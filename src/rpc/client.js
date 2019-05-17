const RPC = require("discord-rpc");
const config = require("../../config/config.js");
const diff = require("../vlc/diff.js");
const format = require("./format.js");
const client = new RPC.Client({ transport: "ipc" });
const log = require("../helpers/logger.js")("RPCClient");
var awake = true;
var timeInactive = 0;


client.login({ clientId: config.rpc.id })
	.then(() => {
		log("Ready.", true);
		setInterval(update, config.rpc.updateInterval);
	})
	.catch(log);

// {Function} update
// Responsible for updating the
// user's presence. Everything
// happens here
function update() {
	diff((status, difference) => {
		if (difference) {
			log("Change detected", true);
			client.setActivity(format(status));
			if (!awake) {
				log("VLC started; waking up.", true);
				client.setActivity(format(status));
				awake = true;
				timeInactive = 0;
			}
		} else {
			if (awake) {
				if (status.state != "playing") {
					timeInactive += config.rpc.updateInterval;
				        if (timeInactive >= config.rpc.sleepTime || status.state=="stopped") {
					        log("VLC not playing; going to sleep.", true);
					        awake = false;
					        client.clearActivity();
				        }
                }
			}
		}
	});
}
