"use strict";
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
var fs = __importStar(require("fs"));
var rl = __importStar(require("readline"));
var rpc_1 = require("./rpc");
var vlc_1 = require("./vlc");
var config = require(__dirname + "/../config/config.json");

function setup() {
    var stringifed;
    var password;
    password = vlc_1.getPassword();
    if (password) {
        config.vlc.password = password;
        stringifed = JSON.stringify(config);
        fs.writeFileSync(__dirname + "/../config/config.json", stringifed);
    }
    return password;
}

function main() {
    setInterval(rpc_1.update, config.rpc.updateInterval);
}

if (config.vlc.password.length === 0) {
    var result = setup();
    var rlInterface = void 0;
    var stringifed_1;
    if (result === undefined) {
        // prompt for password
        rlInterface = rl.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rlInterface.question('Enter your VLC HTTP password: ', function (answer) {
            config.vlc.password = answer;
            stringifed_1 = JSON.stringify(config);
            fs.writeFileSync(__dirname + "/../config/config.json", stringifed_1);
        });
    }
}
main();
