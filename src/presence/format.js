/**
 * Assembles the VLC status
 * to be used as in the
 * user's rich presence
 * @param {Object} status
 */
module.exports = status => {
	var secondLine;
	if (
		status.information.category.meta.filename.match(
			/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4|mkv|MKV)$/
		)
	) {
		secondLine = (status.date || "") + " Video";
	} else if (status.information.category.meta.now_playing) {
		secondLine = status.information.category.meta.now_playing;
	} else {
		secondLine =
			(status.information.category.meta.artist ||
				status.information.category.meta.ALBUMARTIST) +
			" - " +
			status.information.category.meta.album;
	}
	return {
		state: secondLine,
		details:
			status.information.category.meta.title ||
			status.information.category.meta.filename,
		largeImageKey: "vlc",
		smallImageKey: status.state,
		instance: true
	};
};
