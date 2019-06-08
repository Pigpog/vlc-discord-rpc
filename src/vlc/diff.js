/**
 * Checks to see if VLC's
 * status updated
 */
const VLC = require('vlc.js');
const config = require('../../config/config.js');

const VLCClient = new VLC.Client(config.vlc);
// last check
const last = {
  filename: '',
  now_playing: '',
  state: '',
  time: 0,
};

/**
 * @param {Function} callback<Object, Boolean>
 */
module.exports = (callback) => {
  VLCClient.getStatus()
    .then((status) => {
      if (status.information) {
        const { meta } = status.information.category;
        if (meta.now_playing !== last.now_playing) {
          // check stream
          callback(status, true);
        } else if (meta.filename !== last.filename) {
          // check song
          callback(status, true);
        } else if (status.state !== last.state) {
          // check state
          callback(status, true);
        } else if (
          status.time - (last.time + config.rpc.updateInterval / 1000)
          > 3 || last.time > status.time
        ) {
          // check time
          callback(status, true);
        } else if (status.volume !== last.volume) {
          // check volume
          callback(status, true);
          last.volume = status.volume;
        } else callback(status, false);
        last.filename = status.information ? meta.filename : undefined;
        last.now_playing = meta.now_playing;
      } else callback(status);
      last.state = status.state;
      last.time = status.time;
    })
    .catch((err) => {
      throw err;
    });
};
