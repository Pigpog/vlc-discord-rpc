const RPC = require('discord-rpc');
const config = require('../../config/config.js');
const diff = require('../vlc/diff.js');
const format = require('./format.js');
const log = require('../helpers/lager.js');

const client = new RPC.Client({ transport: 'ipc' });
let awake = true;
let timeInactive = 0;

/**
 * @function update
 * Responsible for updating the
   user's presence.
*/
function update() {
  diff((status, difference) => {
    if (difference) {
      client.setActivity(format(status));
      if (!awake) {
        client.setActivity(format(status));
        awake = true;
        log('VLC updated');
        timeInactive = 0;
      }
    } else if (awake) {
      if (status.state !== 'playing') {
        timeInactive += config.rpc.updateInterval;
        if (timeInactive >= config.rpc.sleepTime || status.state === 'stopped') {
          log('VLC not playing; going to sleep.', true);
          awake = false;
          client.clearActivity();
        }
      }
    }
  });
}

client
  .login({ clientId: config.rpc.id })
  .then(() => {
    setInterval(update, config.rpc.updateInterval);
  })
  .catch((err) => {
    throw err;
  });
