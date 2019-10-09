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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) {
        return mod;
    }
    var result = {};
    if (mod != null) {
        for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) {
            result[k] = mod[k];
        }
    }
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", {value: true});
/**
 * @description The RPC module handles formatting the VLCStatus and updating it to the user's
 * discord presence.
 *
 * @author Dylan Hackworth <https://github.com/dylhack>
 * @author Jared Toomey <https://github.com/pigpog>
 */
var RPC = __importStar(require("discord-rpc"));
var vlc_1 = require("./vlc");
var config = require(__dirname + "/../config/config.json");
var client = new RPC.Client({transport: 'ipc'});
var awake;
var timeInactive;
var ready;

function update() {
    return __awaiter(this, void 0, void 0, function () {
        var formatted;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!ready) {
                        return [3 /*break*/, 2];
                    }
                    return [4 /*yield*/, client.login({clientId: config.rpc.id})];
                case 1:
                    _a.sent();
                    ready = true;
                    _a.label = 2;
                case 2:
                    vlc_1.getDifference(function (status, difference) {
                        return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!difference) {
                                            return [3 /*break*/, 2];
                                        }
                                        formatted = format(status);
                                        return [4 /*yield*/, client.setActivity(formatted)];
                                    case 1:
                                        _a.sent();
                                        if (!awake) {
                                            awake = true;
                                            timeInactive = 0;
                                        }
                                        return [3 /*break*/, 4];
                                    case 2:
                                        if (!awake) {
                                            return [3 /*break*/, 4];
                                        }
                                        if (!(status.state !== 'playing')) {
                                            return [3 /*break*/, 4];
                                        }
                                        timeInactive += config.rpc.updateInterval;
                                        if (!(timeInactive >= config.rpc.sleepTime || status.state === 'stopped')) {
                                            return [3 /*break*/, 4];
                                        }
                                        awake = false;
                                        return [4 /*yield*/, client.clearActivity()];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        return [2 /*return*/];
                                }
                            });
                        });
                    })
                         .catch(function (error) {
                             console.log("Error: " + error.message);
                         });
                    return [2 /*return*/];
            }
        });
    });
}

exports.update = update;

function format(status) {
    var end;
    var meta;
    var output = {};
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
            smallImageText: "Volume: " + Math.round(status.volume / 2.56) + "%",
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
            output.state = "Episode " + meta.episodeNumber;
            if (meta.seasonNumber) {
                output.state += " - Season " + meta.seasonNumber;
            }
        } else if (meta.artist) {
            output.state = meta.artist;
        } else {
            output.state = (status.date || '') + " Video";
        }
    } else if (meta.now_playing) {
        // if a stream
        output.state = meta.now_playing;
    } else if (meta.artist) {
        // if in an album
        output.state = meta.artist;
        // if the song is part of an album
        if (meta.album) {
            output.state += " - " + meta.album;
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
