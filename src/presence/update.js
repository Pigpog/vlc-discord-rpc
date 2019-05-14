/**
 * Main module responsible
 * for updating the user's
 * rich presence.
 */
const VLC = require("vlc.js");
const config = require("../../config/config.json");
const VLCClient = new VLC.Client(config.vlc);
const buildPresence = require("./format.js");
var meta = {
	lastFileName: "",
	lastState: "",
	loggedIn: true,
	timeInactive: 0
};

module.exports = client => {
	VLCClient.getStatus()
		.then(status => {
			if (
				status.state === "paused" ||
				status.state === "stopped"
			) {
				if (meta.loggedIn) {
					meta.timeInactive +=
						config.rpc.updateInterval;
					if (
						meta.timeInactive >
						config.rpc.sleepTime
					) {
						console.log("Sleeping");
						client.disconnect();
						meta.loggedIn = false;
					}
				}
			} else {
				meta.timeInactive = 0;
				if (!meta.loggedIn) {
					console.log("Waking");
					client = rich(id);
					meta.loggedIn = true;
				}
			}
			if (
				(status.information.category.meta.filename !==
					meta.lastFileName ||
					status.state !== meta.lastState) &&
				meta.loggedIn
			) {
				console.log("Changes detected.");
				client.updatePresence(buildPresence(status));
			}
			meta.lastFileName =
				status.information.category.meta.filename;
			meta.lastState = status.state;
		})
		.catch(console.log);
};
