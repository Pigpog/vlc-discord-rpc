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
				// check stream
				callback(
					status,
					status.information.category.meta
						.now_playing
				);
				// check song
				callback(
					status,
					status.information.category.meta
						.filename != last.filename
				);
				// check state
				callback(status, status.state != last.state);

				last.filename = status.information
					? status.information.category.meta
							.filename
					: undefined;
				last.now_playing = status.information.category.meta.now_playing; // stream
				last.state = status.state;
			}
		})
		.catch(err => {
			log("Error, " + err.message);
		});
};
