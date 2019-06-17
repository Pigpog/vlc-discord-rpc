/**
 * Starting point for
 * vlc-discord-rpc
 */
const { spawn } = require('child_process');
const config = require('../config/config.js');
const log = require('./helpers/lager.js');
require('./rpc/client.js');

log('Started, config', config);
if (!(config.vlc.detached || process.argv.includes('detached'))) {
  const command = config.startupCommands[process.platform] || 'vlc';
  // HACK: set config.vlc.address to your friends VLC hostname
  // in the config to display their songs on your presence.
  const child = spawn(command, ['--extraintf', 'http', '--http-host', config.vlc.address, '--http-password', config.vlc.password, '--http-port', config.vlc.port]);
  child.on('exit', () => {
    process.exit(0);
  });
  child.on('error', () => {
    process.exit(1);
  });
}
