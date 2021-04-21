/**
 * Description: This file manages the Discord side of things.
 */

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
      console.log("Presence updated")
      if (!awake) {
        awake = true;
        timeInactive = 0;
      }
    } else if (awake) {
      if (status.state !== 'playing') {
        timeInactive += config.rpc.updateInterval;
        if ((timeInactive >= config.rpc.sleepTime) || (!config.rpc.showStopped && status.state === 'stopped')) {
          log('VLC not playing; going to sleep.', true);
          awake = false;
          client.clearActivity();
        } else {
	  console.log("Presence updated")
	  client.setActivity(format(status));
	  awake = false;
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
