/**
 * Description: This file manages the Discord side of things.
 */
import RPC from 'discord-rpc';
import * as config from '../../config/config.js';
import diff from '../vlc/diff.js';
import format from './format.js';
import log from '../helpers/lager.js';

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
      console.log("Presence updated")

      if (!awake) {
        awake = true;
        timeInactive = 0;
      }

      if (status.state === 'stopped' && !config.rpc.showStopped) {
        console.log("Stopped; Clearing presence");
        client.clearActivity();
        awake = false;
      }
    } else if (awake) {
      if (status.state !== 'playing') {
        timeInactive += config.rpc.updateInterval;
        if ((timeInactive >= config.rpc.sleepTime)) {
          log('VLC not playing; going to sleep.', true);
          awake = false;
          client.clearActivity();
        }
      }
    }
  });
}

client.on('ready', () => {
  console.log('Logged in as', client.user.username);
})

// This is only a function because it makes it easier to retry
function discordLogin () {
  console.log("Connecting to Discord...")
  client
    .login({ clientId: config.rpc.id })
    .then(() => {
      setInterval(update, config.rpc.updateInterval);
    })
    .catch((err) => {
      if(err.toString() === "Error: Could not connect") {
        console.log("Failed to connect to Discord. Is your Discord client open? Retrying in 20 seconds...");
        // Retry login
        setTimeout(discordLogin, 20000)
      } else {
        console.log("An unknown error occurred when connecting to Discord");
        throw err;
      }
    });
}

discordLogin();
