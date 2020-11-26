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
	win32: 'C:/Program Files (x86)/VideoLAN/VLC/vlc.exe',
	linux: '/usr/bin/vlc',
	unix: '/usr/bin/vlc',
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
  const command = config.vlcPath || platformDefaults[process.platform] || 'vlc';
  const child = spawn(command, ['--extraintf', 'http', '--http-host', config.vlc.address, '--http-password', config.vlc.password, '--http-port', config.vlc.port]);
  child.on('exit', () => {
    process.exit(0);
  });
  child.on('error', () => {
    process.exit(1);
  });
}
