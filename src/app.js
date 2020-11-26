/**
 * Starting point for
 * vlc-discord-rpc
 */
const { spawn } = require('child_process');
const fs = require('fs');
const config = require('../config/config.js');
const log = require('./helpers/lager.js');
require('./rpc/client.js');

const platformDefaults= {
	win32: 'C:/Program Files/VideoLAN/VLC/vlc.exe',
	// Alternative path to Windows VLC executable
	winalt: 'C:/Program Files (x86)/VideoLAN/VLC/vlc.exe',
	linux: '/usr/bin/vlc',
	unix: '/usr/bin/vlc',
	// Mac OS
	darwin: '/Applications/VLC.app/Contents/MacOS/VLC',
};

// Generates a random password
function randomPass() {
  return Math.random()
    .toString(36)
    .slice(-8);
}

// Use a random password if none is supplied
if (config.vlc.password === "") config.vlc.password = randomPass();

log('Started, config', config);
if (!(config.rpc.detached || process.argv.includes('detached'))) {
	if(process.platform === "win32"){
		if(!fs.existsSync(platformDefaults.win32)){
			// Use alternative Windows path
			platformDefaults.win32=platformDefaults.winalt;
		}
	}
  const command = config.vlcPath || platformDefaults[process.platform] || 'vlc';
  const child = spawn(command, ['--extraintf', 'http', '--http-host', config.vlc.address, '--http-password', config.vlc.password, '--http-port', config.vlc.port]);
  child.on('exit', () => {
  	console.log("VLC closed; Exiting.");
    process.exit(0);
  });
  child.on('error', () => {
  	console.log("------------------------------------");
  	console.log("ERROR: A problem occurred while launching VLC. Most likely, you installed VLC to a weird spot and will need to set the vlcPath value in config/config.js to the path to your vlc executable (eg. vlcPath: \"C:/Program Files/videolan/vlc/vlc.exe\")");
  	console.log("------------------------------------");
  	console.log("Waiting 20 seconds before exiting to give you time to read the error message :)");
  	setTimeout(process.exit, 20000, 1)
  });
}
