/**
 * Main module responsible
 * for updating the user's
 * rich presence.
 */
const VLC = require("vlc.js");
const config = require("../../config/config.json");
const VLCClient = new VLC.Client(config.vlc);
const buildPresence = require("./format.js");
var meta = {
  lastFileName: "",
  lastState: "",
  asleep: false,
  timeInactive: 0
};

module.exports = client => {
  VLCClient.getStatus()
    .then(status => {
      if (status.state === "paused" || status.state === "stopped") {
        if (!meta.asleep) {
          meta.timeInactive += config.rpc.updateInterval;
          if (meta.timeInactive > config.rpc.sleepTime) {
            console.log("Sleeping");
            meta.asleep = true;
          }
        }
      } else {
        meta.timeInactive = 0;
        if (meta.asleep) {
          console.log("Waking");
          meta.asleep = false;
        }
      }
      if (
        (status.information.category.meta.filename !== meta.lastFileName ||
          status.state !== meta.lastState) &&
        !meta.asleep
      ) {
        console.log("Changes detected.");
        client.updatePresence(buildPresence(status));
      }
      meta.lastFileName = status.information.category.meta.filename;
      meta.lastState = status.state;
    })
    .catch(console.log);
};

