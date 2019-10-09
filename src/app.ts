import * as fs         from 'fs';
import * as rl         from 'readline';
import { update }      from './rpc';
import { getPassword } from './vlc';

const config = require(`${__dirname}/../config/config.json`);

function setup(): string | undefined {
    let stringifed: string;
    let password: string | undefined;

    password = getPassword();
    if (password) {
        config.vlc.password = password;
        stringifed = JSON.stringify(config);
        fs.writeFileSync(`${__dirname}/../config/config.json`, stringifed);
    }
    return password;
}

function main() {
    setInterval(update, config.rpc.updateInterval);
}

if (config.vlc.password.length === 0) {
    const result = setup();
    let rlInterface: rl.Interface;
    let stringified: string;

    if (result === undefined) {
        // prompt for password
        rlInterface = rl.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rlInterface.question('Enter your VLC HTTP password: ', (answer: string) => {
            config.vlc.password = answer;
            stringified = JSON.stringify(config);
            fs.writeFileSync(`${__dirname}/../config/config.json`, stringified);
        });
    }
}
main();
