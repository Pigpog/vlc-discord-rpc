/**
 * Description: Decides what information to display based on the nature of the media (video, music, etc)
 */
import log from '../helpers/lager.js';
import fs from 'fs';
import * as config from '../../config/config.js';

let art = null;

function getArt() {
  if (art) {
    return art
  }
  const data = fs.readFileSync(`${__dirname}/../../config/art.json`);
  const dataStr = data.toString();
  art = JSON.parse(dataStr);

  return art;
}

export default function format(status) {
  // if playback is stopped
  if (status.state === 'stopped') {
    return {
      state: 'Stopped',
      details: 'Nothing is playing',
      largeImageKey: config.rpc.largeIcon,
      smallImageKey: 'stopped',
      instance: true,
    };
  } // else
  const { meta } = status.information.category;
  const albumArt = getArt();
  const output = {
    details: meta.title || meta.filename,
    largeImageKey: albumArt[meta.album] || config.rpc.largeIcon,
    smallImageKey: status.state,
    smallImageText: `Volume: ${Math.round(status.volume / 2.56)}%`,
    instance: true,
  };
  // if video
  if (status.stats.decodedvideo > 0) { 
    // if youtube video
    if (meta['YouTube Start Time'] !== undefined) {
      output.largeImageKey = 'youtube';
      output.largeImageText = meta.url;
    }
    // if a tv show
    if (meta.showName) output.details = meta.showName;
    if (meta.episodeNumber) {
      output.state = `Episode ${meta.episodeNumber}`;
      if (meta.seasonNumber) {
        output.state += ` - Season ${meta.seasonNumber}`;
      }
    } else if (meta.artist) {
      output.state = meta.artist;
    } else {
      output.state = `${(status.date || '')} Video`;
    }
  } else if (meta.now_playing) {
    // if a stream
    output.state = meta.now_playing || "Stream";
  } else if (meta.artist) {
    // if in an album
    output.state = meta.artist;
    // if the song is part of an album
    if (meta.album) output.state += ` - ${meta.album}`;
    // display track #
    if (meta.track_number && meta.track_total && config.rpc.displayTrackNumber) {
      output.partySize = parseInt(meta.track_number, 10);
      output.partyMax = parseInt(meta.track_total, 10);
    }
  } else {
    output.state = status.state;
  }
  const end = Math.floor(Date.now() / 1000 + ((status.length - status.time) / status.rate));
  if (status.state === 'playing' && config.rpc.displayTimeRemaining && status.length != 0) {
    output.endTimestamp = end;
  }
  log('Format output', output);
  return output;
};
