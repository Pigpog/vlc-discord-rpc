import fs from 'fs';
import os from 'os';
import path from 'path';
import Client from 'vlc.js';
import { vlc } from '../../config/config.js';

const client = new Client(vlc.address, vlc.password);
const destination = '/../../logs/';
const logs = [{
  details: {
    arch: os.arch(),
    type: os.type(),
  }
}];

export default function lager(...args) { 
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
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }
  fs.writeFileSync(`${destination}${Date.now()}.log`, JSON.stringify(logs));
});
