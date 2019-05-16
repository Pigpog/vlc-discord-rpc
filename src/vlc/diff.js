/**
 * Checks to see if VLC's
 * status updated
 */
const config = require("../../config/config.json");
const VLC = require("vlc.js");
const logger = require("../helpers/logger.js");
const log = logger("VLCClient", "YELLOW");
const VLCClient = new VLC.Client(config.vlc);
// last check
const last = {
	filename: "",
	now_playing: "",
	state: ""
};

/**
 * @param {Function} callback<Object, Boolean>
 */
module.exports = callback => {
	VLCClient.getStatus()
		.then(status => {
			if (status.information) {
				let meta = status.information.category.meta;
				if (meta.now_playing !== last.now_playing) {
					// check stream
					callback(status, true);
				} else if (meta.filename != last.filename) {
					// check song
					callback(status, true);
				} else if (status.state != last.state) {
					// check state
					callback(status, true);
				} else callback(status, false);
				last.filename = status.information
					? meta.filename
					: undefined;
				last.now_playing = meta.now_playing;
				last.state = status.state;
			} else callback(status);
		})
		.catch(err => {
			log("Error, " + JSON.stringify(err.message));
		});
};
