const client = require('discord-rich-presence')('410664151334256663');	//last part is the app id for discord. Dont change.
const config=require("./config.js");

var vlcService = require("droopy-vlc"),
    vlc = new vlcService("http://:"+config.vlcPass+"@"+config.vlcHost+":"+config.vlcPort);
console.log("Running...")

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
		var secondline=""
		if(status.isVideo){	//if watching video
			secondline=escapeHtml(status.date || "")+" Video";
 		}else if(status.streamtrack){	//if listening to audio stream
			secondline=escapeHtml(status.streamtrack);
		}else{	//meant for music
			secondline=escapeHtml(status.artist+" - "+status.album);
		}
		var newPlaying={
		  state: secondline,
		  details: escapeHtml(status.title),
		  largeImageKey: "vlc",
		  smallImageKey: status.state,
		  instance: true,
		  endTimestamp:parseInt(parseInt(Date.now()/1000)+(parseInt(status.duration)-parseInt(status.time))/status.rate),
		}
		if(newPlaying.state!==nowPlaying.state || newPlaying.details!==nowPlaying.details || newPlaying.smallImageKey!==nowPlaying.smallImageKey || newPlaying.endTimestamp!==nowPlaying.endTimestamp){	//if anything has changed
			console.log("Changes detected; sending to Discord")
			if(status.state==="playing" && !status.streamtrack){	//Streams dont give audio length i think so omit end timestamp
				newPlaying.startTimestamp=Date.now()/1000
				newPlaying.endTimestamp=parseInt(parseInt(Date.now()/1000)+(parseInt(status.duration)-parseInt(status.time))/status.rate)
			}else{
			  delete newPlaying.endTimestamp
			}
			client.updatePresence(newPlaying);
			delete newPlaying.startTimestamp
			nowPlaying=newPlaying
		}
	}, function (error){	//if nothing is playing
		//console.log(error) //uncomment for debug
		var newPlaying={
			state: "Stopped",
			details: "Nothing is playing.",
			largeImageKey: "vlc",
			smallImageKey: "stopped",
			instance: true,
		}
		client.updatePresence(newPlaying);
	}
	);
}

if(process.argv.includes("withvlc")){	//if you want vlc to open with
	const { spawn } = require('child_process');
	var command=""
	if(process.platform==="win32"){
		command=config.windowsvlc
	}else if(process.platform==="linux"){
		command=config.linuxvlc
	}else if(process.platform==="darwin"){
		command=config.macvlc
	}else{
		command="vlc"
	}
	var child = spawn(command, [])	//launch vlc
	child.on("exit", () => {
		process.exit(0)
	})
}

update()
setInterval(update,5000)	//check for updates every 5000ms (5 seconds)
