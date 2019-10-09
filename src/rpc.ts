/**
 * @description The RPC module handles formatting the VLCStatus and updating it to the user's
 * discord presence.
 *
 * @author Dylan Hackworth <https://github.com/dylhack>
 * @author Jared Toomey <https://github.com/pigpog>
 */
import * as RPC            from 'discord-rpc';
import { Presence }        from 'discord-rpc';
import { Meta, VLCStatus } from 'vlc.js/lib/src/http/classes/VLCStatus';
import { getDifference }   from './vlc';

const config = require(`${__dirname}/../config/config.json`);
const client = new RPC.Client({ transport: 'ipc' });

let awake: boolean;
let timeInactive: number;
let ready: boolean;

export async function update() {
    let formatted: Presence;
    if (!ready) {
        await client.login({ clientId: config.rpc.id });
        ready = true;
    }
    getDifference(async (status, difference) => {
        if (difference) {
            formatted = format(status);
            await client.setActivity(formatted);
            if (!awake) {
                awake = true;
                timeInactive = 0;
            }
        } else if (awake) {
            if (status.state !== 'playing') {
                timeInactive += config.rpc.updateInterval;
                if (timeInactive >= config.rpc.sleepTime || status.state === 'stopped') {
                    awake = false;
                    await client.clearActivity();
                }
            }
        }
    })
        .catch((error: Error) => {
            console.log(`Error: ${error.message}`);
        });
}

function format(status: VLCStatus): Presence {
    let end: number;
    let meta: any & Meta;
    let output: Presence = {};

    // if playback is stopped
    if (status.state === 'stopped') {
        return {
            state: 'Stopped',
            details: 'Nothing is playing.',
            largeImageKey: 'vlc',
            smallImageKey: 'stopped',
            instance: true,
        };
    }

    if (status.information) {
        meta = status.information.category.meta;
        return {
            details: meta.title || meta.filename,
            largeImageKey: 'vlc',
            smallImageKey: status.state,
            smallImageText: `Volume: ${Math.round(status.volume / 2.56)}%`,
            instance: true,
        };
    }
    if (status.stats && status.stats.decodedvideo > 0) { // video
        // if youtube video
        if (meta['YouTube Start Time'] !== undefined) {
            output.largeImageKey = 'youtube';
            output.largeImageText = meta.url;
        }
        // if a tv show
        if (meta.showName) {
            output.details = meta.showName;
        }

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
        output.state = meta.now_playing;
    } else if (meta.artist) {
        // if in an album
        output.state = meta.artist;
        // if the song is part of an album
        if (meta.album) {
            output.state += ` - ${meta.album}`;
        }
        // display track #
        if (meta.track_number && meta.track_total) {
            output.partySize = parseInt(meta.track_number, 10);
            output.partyMax = parseInt(meta.track_total, 10);
        }
    } else {
        output.state = status.state;
    }
    end = Math.floor((Date.now() / 1000 + (status.length - status.time)) / status.rate);
    if (status.state === 'playing') {
        output.endTimestamp = end;
    }
    return output;
}
