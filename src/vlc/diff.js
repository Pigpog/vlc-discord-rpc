/**
 * Checks to see if VLC's
 * status updated
 */
const config = require("../../config/config.json");
const VLC = require("vlc.js");
const log = require("../helpers/logger.js")("VLCClient");
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
					log(`Stream updated "${meta.now_playing}"`);
					callback(status, true);
				} else if (meta.filename != last.filename) {
					// check song
					log(`Song updated "${meta.filename}"`);
					callback(status, true);
				} else if (status.state != last.state) {
					// check state
					log(`State updated "${status.state}"`);
					callback(status, true);
				} else callback(status, false);
				last.filename = status.information
					? meta.filename
					: undefined;
				last.now_playing = meta.now_playing;
				last.state = status.state;
			} else callback(status);
		})
		.catch(log);
};
