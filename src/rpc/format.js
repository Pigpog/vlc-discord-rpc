module.exports = status => {
	// if playback is stopped
	if (status.state == "stopped") {
		return {
			state: "Stopped",
			details: "Nothing is playing.",
			largeImageKey: "vlc",
			smallImageKey: "stopped",
			instance: true
		};
	} // else
	var meta = status.information.category.meta;
	var output = {
		details: meta.title || meta.filename,
		largeImageKey: "vlc",
		smallImageKey: status.state,
		smallImageText:"Volume: "+Math.round(status.volume/2.56)+"%",
		instance: true,
	};
	if (status.stats.decodedvideo > 0) { // video
		// if a tv show
		if(meta.showName) output.details = meta.showName;
		if(meta.episodeNumber){
			output.state = "Episode " + meta.episodeNumber;
			if(meta.seasonNumber) {
				output.state += " - Season " + meta.seasonNumber;
			}
		}else{
			output.state = (status.date || "") + " Video";
		}
	} else if (meta.now_playing) {
		// if a stream
		output.state = meta.now_playing;
	} else if (meta.artist){
		// if in an album
		output.state = meta.artist;
		// if the song is part of an album
		if (meta.album) output.state += " - " + meta.album;
		// display track #
		if (meta.track_number && meta.track_total) {
			output.partySize = parseInt(meta.track_number);
			output.partyMax = parseInt(meta.track_total);
		}
	}else{
		output.state = status.state;
	}
	if(status.state=="playing"){
		output.endTimestamp = Math.floor((Date.now() / 1000 +(status.length - status.time)) / status.rate);
	}
	return output;
};
