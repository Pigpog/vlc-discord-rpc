const client = require('discord-rich-presence')('410664151334256663');	//last part is the app id for discord. Dont change.
const config=require("./config.js");
var vlcService = require("droopy-vlc"),
    vlc = new vlcService("http://:"+config.vlcPass+"@"+config.vlcHost+":"+config.vlcPort);

function escapeHtml(text) {
  return text
      .replace(/(&#39;)/g,"'")
      .replace(/(&amp;)/g,"&")
      .replace(/(&lt;)/g,"<")
      .replace(/(&gt;)/g,">")
      .replace(/(&quot;)/g,'"')
}

//used to check if there have been updates
var nowPlaying={
  state: '',
  details: '',
  largeImageKey: '',
  smallImageKey: '',
  instance: true,
}

//checks for changes in playback and if it finds any it updates your presence
function update(){
	vlc.status().then(function(status) {
		var newPlaying={
		  state: escapeHtml(status.artist+" - "+status.album),
		  details: escapeHtml(status.title),
		  largeImageKey: "vlc",
		  smallImageKey: status.state,
		  instance: true,
		}
		if(newPlaying.state!==nowPlaying.state || newPlaying.details!==nowPlaying.details || newPlaying.smallImageKey!==nowPlaying.smallImageKey){
			console.log("Changes detected; sending to Discord")
			if(status.state==="playing"){
				newPlaying.startTimestamp=Date.now()/1000
				newPlaying.endTimestamp=parseInt(parseInt(Date.now()/1000)+(parseInt(status.duration)-parseInt(status.time)))
				client.updatePresence(newPlaying);
			}else{
				client.updatePresence(newPlaying);
			}
			delete newPlaying.startTimestamp
			delete newPlaying.endTimestamp
			nowPlaying=newPlaying
		}
	});
}

update()
setInterval(update,5000)	//check for updates every 5000ms (5 seconds)