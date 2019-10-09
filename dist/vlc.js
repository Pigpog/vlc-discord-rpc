"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }

    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }

        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }

        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = {
        label: 0, sent: function () {
            if (t[0] & 1) {
                throw t[1];
            }
            return t[1];
        }, trys: [], ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;

    function verb(n) { return function (v) { return step([n, v]); }; }

    function step(op) {
        if (f) {
            throw new TypeError("Generator is already executing.");
        }
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) {
                return t;
            }
            if (y = 0, t) {
                op = [op[0] & 2, t.value];
            }
            switch (op[0]) {
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {value: op[1], done: false};
                case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) {
                        _.ops.pop();
                    }
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];
            y = 0;
        } finally { f = t = 0; }
        if (op[0] & 5) {
            throw op[1];
        }
        return {value: op[0] ? op[1] : void 0, done: true};
    }
};
Object.defineProperty(exports, "__esModule", {value: true});
/**
 * @description This module handles the interaction with VLC, all communication is done here. it
 * requires the module vlc.js which creates http requests to the mini http server that VLC
 * hosts. For us to update the users presence we must do it based on difference basically whether
 * or not the status of the VLC media player has changed. *
 * @author Dylan Hackworth <https://github.com/dylhack>
 * @author Jared Toomey <https://github.com/pigpog>
 */
var vlc_js_1 = require("vlc.js");
var config = require(__dirname + "/../config/config.json");
var client = new vlc_js_1.VLCClient(config.vlc);
var vlcRC = vlc_js_1.editVLCRC();
var last = {
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
function getDifference(callback) {
    return __awaiter(this, void 0, void 0, function () {
        var status, meta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/, client.getStatus()];
                case 1:
                    status = _a.sent();
                    if (status.information) {
                        meta = status.information.category.meta;
                        // Checks the now_playing meta property, this is good for streams
                        if (meta.now_playing !== last.now_playing) {
                            callback(status, true);
                            // Check the filename
                        } else if (meta.filename !== last.filename) {
                            callback(status, true);
                            // Checking the state (paused / playing)
                        } else if (status.state !== last.state) {
                            callback(status, true);
                            // Check the end timestamp
                        } else if ((3 < status.time - (last.time + config.rpc.updateInterval / 1000))
                            || (last.time > status.time)) {
                            callback(status, true);
                            // Check the volume
                        } else if (status.volume !== last.volume) {
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
                    return [2 /*return*/];
            }
        });
    });
}

exports.getDifference = getDifference;

/**
 * This allows us to get the HTTP password from the vlcrc located in the user's application data
 * directory (.config for linux & mac, appdata for windows). It will fail if VLC has never been
 * initialised and it'll return exactly what it finds so if there is no http password it'll
 * return an empty string.
 * @private
 * @returns {String | undefined}
 */
function getPassword() {
    var password;
    if (vlcRC) {
        password = vlcRC.get('http-password');
        if (password) {
            return password.value;
        }
    }
}

exports.getPassword = getPassword;
