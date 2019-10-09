/**
 * @description This module handles the interaction with VLC, all communication is done here. it
 * requires the module vlc.js which creates http requests to the mini http server that VLC
 * hosts. For us to update the users presence we must do it based on difference basically whether
 * or not the status of the VLC media player has changed. *
 * @author Dylan Hackworth <https://github.com/dylhack>
 * @author Jared Toomey <https://github.com/pigpog>
 */
import { editVLCRC, VLCClient } from 'vlc.js';
import { VLCError }             from 'vlc.js/lib/src/http/classes/VLCError';
import { Meta, VLCStatus }      from 'vlc.js/lib/src/http/classes/VLCStatus';
import { VLCCredentials }       from 'vlc.js/lib/src/http/Requester';
import { ConfigItem }           from 'vlc.js/lib/src/util/VLCRCModifier';

const config = require(`${__dirname}/../config/config.json`);
const client = new VLCClient(config.vlc);
const vlcRC = editVLCRC();
const log = console.log;
type DifferenceCallback = (status: VLCStatus, difference: boolean) => void;
type ErrorCodes = 'EACCES' | 'EADDRINUSE' | 'ECONNREFUSED' | 'ECONNRESET' | 'EEXIST' | 'EISDIR'
    | 'EMFILE' | 'ENOENT' | 'ENOTDIR' | 'ENOTEMPTY' | 'ENOTFOUND' | 'EPERM' | 'EPIPE' | 'ETIMEDOUT';
type SystemError = {
    address: string;
    code: ErrorCodes;
    dest: string;
    errno: number | ErrorCodes;
    info: Object;
    message: string;
    path: string;
    port: number;
    syscall: string;
}
let last = {
    filename: '',
    now_playing: '',
    state: '',
    time: 0,
    volume: 0
};

/**
 * getDifference function is a callback-oriented function that gives developers the current
 * status of VLC and whether or not there was a difference from last time this function was
 * called. It only cherry picks a handful of properties and here they are:
 * - information.category.meta.now_playing
 * - information.category.meta.filename
 * - time
 * - volume
 * - state
 * @param {DifferenceCallback} callback
 */
export async function getDifference(callback: DifferenceCallback): Promise<void> {
    const status = await client.getStatus();
    let meta: Meta;
    if (status.information) {
        meta = status.information.category.meta;

        // Checks the now_playing meta property, this is good for streams
        if (meta.now_playing !== last.now_playing) {
            log('The stream has updated');
            callback(status, true);

            // Check the filename
        } else if (meta.filename !== last.filename) {
            log('The filename has updated');
            callback(status, true);

            // Checking the state (paused / playing)
        } else if (status.state !== last.state) {
            log('State has updated');
            callback(status, true);

            // Check the end timestamp
        } else if (
            (3 < status.time - (last.time + config.rpc.updateInterval / 1000))
            || (last.time > status.time)
        ) {
            log('The timestamp has updated');
            callback(status, true);

            // Check the volume
        } else if (status.volume !== last.volume) {
            log('The volume has updated');
            callback(status, true);
            last.volume = status.volume;
        } else {
            // Finally if nothing was changed callback false.
            callback(status, false);
        }
        last.filename = meta.filename;
        last.now_playing = meta.now_playing;
    } else {
        callback(status, false);
    }
    last.state = status.state;
    last.time = status.time;
}

/**
 * This allows us to get the HTTP password from the vlcrc located in the user's application data
 * directory (.config for linux & mac, appdata for windows). It will fail if VLC has never been
 * initialised and it'll return exactly what it finds so if there is no http password it'll
 * return an empty string.
 * @private
 * @returns {String | undefined}
 */
export function getPassword(): string | undefined {
    let password: ConfigItem | undefined;
    if (vlcRC) {
        password = vlcRC.get('http-password');
        if (password) {
            return password.value;
        }
    }
}

/**
 * This function handles errors that the user may run into while interacting with VLC's http
 * server. For all the errors that may appear see the following link.
 * @link https://nodejs.org/docs/latest-v11.x/api/errors.html#errors_common_system_errors
 * @param e
 */
export function handleError(e: SystemError | VLCError | Error): void {
    let sysError: SystemError;

    if (e instanceof Error) {
        console.log(`An error occurred: ${e.message}`);
    }
    if (e instanceof VLCError) {
        console.log(`Failed to connect to VLC, is the password correct? ${e.message}`);
    } else {
        sysError = e as SystemError;
        if (sysError.code === 'ECONNREFUSED') {
            console.log(`Failed to connect, is VLC running? ${sysError.code}`);
        } else {
            console.log(`An unhandled error occurred: ${e.message}`);
        }
    }
}

export function update(details: VLCCredentials) {
    client.update(details);
}
