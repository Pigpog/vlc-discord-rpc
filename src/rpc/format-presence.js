module.exports = status => {
	var secondLine;
	var meta = status.information.category.meta;
	if (
		meta.filename.match(
			/^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4|mkv|MKV)$/
		)
	) {
		secondLine = (status.date || "") + " Video";
	} else if (meta.now_playing) {
		secondLine = meta.now_playing;
	} else {
		if (meta.artist) {
			secondLine += meta.artist;
			if (meta.album) secondLine += " - " + meta.album;
		}
	}
	if (status.state != "playing") {
		return {
			state: "Stopped",
			details: "Nothing is playing.",
			largeImageKey: "vlc",
			smallImageKey: "stopped",
			instance: true
		};
	} else {
		return {
			state: secondLine,
			details: meta.title || meta.filename,
			largeImageKey: "vlc",
			smallImageKey: status.state,
			instance: true,
			endTimestamp:
				status.state == "playing"
					? Math.floor(
							(Date.now() / 1000 +
								(status.length -
									status.time)) /
								status.rate
					  )
					: undefined
		};
	}
};
