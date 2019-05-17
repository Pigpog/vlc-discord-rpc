module.exports = status => {
	var secondLine = "";
	var meta = status.information.category.meta;
	if (meta.filename.toLowerCase().match(/^.*\.(avi|wmv|flv|mpg|mp4|mkv)$/)) {
		// if a video
		secondLine = (status.date || "") + " Video";
	} else if (meta.now_playing) {
		// if a stream
		secondLine = meta.now_playing;
	} else {
		if (meta.artist) {
			secondLine += meta.artist;
			// if in an album
			if (meta.album) secondLine += " - " + meta.album;
		}
	}
	if (status.state == "stopped") {
		// if nothing is playing
		return {
			state: "Stopped",
			details: "Nothing is playing.",
			largeImageKey: "vlc",
			smallImageKey: "stopped",
			instance: true
		};
	} else {
		// if something is playing
		return {
			state: secondLine.length > 2 
				? secondLine
				: status.state,
			details: meta.title || meta.filename,
			largeImageKey: "vlc",
			smallImageKey: status.state,
			instance: true,
			endTimestamp:
				status.length != 0 && status.state=="playing"
					? Math.floor((Date.now() / 1000 +(status.length - status.time)) / status.rate)
					: undefined
		};
	}
};
