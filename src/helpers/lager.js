/* eslint-disable comma-dangle */
const fs = require('fs');
const os = require('os');
const path = require('path');
const VLC = require('vlc.js');
const { vlc } = require('../../config/config.js');

const client = new VLC.Client(vlc);
const destination = path.join(__dirname, '/../../logs/');
const logs = [{
  details: {
    arch: os.arch(),
    type: os.type()
  }
}];

module.exports = (...args) => {
  const log = {
    msg: args,
    time: Date.now()
  };
  client.getStatus()
    .then((status) => {
      log.status = status;
      logs.push(log);
    })
    .catch((err) => {
      log.status = err.message;
      logs.push(log);
    });
};

process.on('exit', () => {
  if (!fs.existsSync(destination)) fs.mkdirSync(destination);
  fs.writeFileSync(`${destination}${Date.now()}.log`, JSON.stringify(logs));
});
