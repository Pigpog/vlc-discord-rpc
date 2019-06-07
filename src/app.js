/**
 * Starting point for
 * vlc-discord-rpc
 */
const { spawn } = require('child_process');
const config = require('../config/config.js');
const log = require('./helpers/logger.js')('App');
require('./rpc/client.js');


if (!process.argv.includes('detached')) {
  const command = config.startupCommands[process.platform] || 'vlc';
  // HACK: set config.vlc.address to your friends VLC hostname
  // in the config to display their songs on your presence.
  const child = spawn(command, ['--extraintf', 'http', '--http-host', config.vlc.address, '--http-password', config.vlc.password, '--http-port', config.vlc.port]);
  child.on('exit', () => {
    log('VLC closed, closing.', true);
    process.exit(0);
  });
  child.on('error', () => {
    console.log('------------------------------------');
    console.log('An error occurred when launching VLC');
    console.log('------------------------------------');
    process.exit(1);
  });
}
