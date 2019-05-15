const config=require("./config.json");
var richPresence = require('discord-rich-presence');	// Log into discord rich presence
var client=richPresence(config.discordAppID);

var vlcService = require("droopy-vlc"),
	vlc = new vlcService("http://:"+encodeURIComponent(config.vlc.password)+"@"+config.vlc.host+":"+config.vlc.port);

console.log("Connecting to Discord...")

function escapeHtml(text) {
  return text
      .replace(/(&#39;)/g,"'")
      .replace(/(&amp;)/g,"&")
      .replace(/(&lt;)/g,"<")
      .replace(/(&gt;)/g,">")
      .replace(/(&quot;)/g,'"')
}

var timeInactive = 0;
var loggedIn=true;

//used to check if there have been updates
var nowPlaying={
  state: '',
  details: '',
  largeImageKey: '',
  smallImageKey: '',
  instance: true,
}

function sleep(){
    client.disconnect();
    loggedIn=false;
}

function wake(){
    client=richPresence(config.discordAppID);
    loggedIn=true;
}

//checks for changes in playback and if it finds any it updates your presence
function update(){
	vlc.status().then(function(status) {
		var secondline="";
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
        if(status.state==="paused"){
            delete newPlaying.endTimestamp
            if(loggedIn){
                timeInactive+=config.updateInterval;
                if(timeInactive>config.sleepTime){
                    console.log("Sleeping");
                    sleep();
                }
            }
        }else{
            if(loggedIn===false){
                console.log("Waking up")
                wake();
            }
            timeInactive=0
        }
        if((newPlaying.state!==nowPlaying.state || newPlaying.details!==nowPlaying.details || newPlaying.smallImageKey!==nowPlaying.smallImageKey || newPlaying.endTimestamp!==nowPlaying.endTimestamp) && loggedIn){	//if anything has changed
			console.log("Changes detected; sending to Discord")
			if(status.state==="playing" && !status.streamtrack){	//Streams dont give audio length i think so omit end timestamp
				newPlaying.startTimestamp=Math.floor(Date.now()/1000)
				newPlaying.endTimestamp=parseInt(parseInt(Date.now()/1000)+(parseInt(status.duration)-parseInt(status.time))/status.rate)
			}else{
			  delete newPlaying.endTimestamp
			}
			client.updatePresence(newPlaying);
			delete newPlaying.startTimestamp
			nowPlaying=newPlaying
		}
	}, function (error){	//if nothing is playing
		var newPlaying={
			state: "Stopped",
			details: "Nothing is playing.",
			largeImageKey: "vlc",
			smallImageKey: "stopped",
			instance: true,
        }
        if(nowPlaying.smallImageKey!=="stopped"){
            client.updatePresence(newPlaying);
        }else{
            nowPlaying=newPlaying;
        }
        if(loggedIn){
            timeInactive+=config.updateInterval;
        }
        if(timeInactive>config.sleepTime){
            sleep();
        }
	});
}

if(process.argv.includes("withvlc")){	//if you want vlc to open with this script
	const { spawn } = require('child_process');
	var command=(config.startupCommands[process.platform] || "vlc");	// Selects the appropriate command to start VLC
	var child = spawn(command, [])	//launch vlc
	child.on("exit", () => {
		process.exit(0);
	})
}

client.on('connected', () => {
    console.log('Connected to Discord');
    update();
    setInterval(update,config.updateInterval);	//check for updates every 5000ms (5 seconds)
})
