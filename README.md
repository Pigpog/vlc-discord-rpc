# vlc-discord-rpc
Discord rich presence for VLC media player.

![Example](./example.png)


## Requirements
- [NodeJS and NPM](https://nodejs.org/en/)
- [VLC](https://www.videolan.org/index.html)
- [Discord desktop client](https://discordapp.com/)

## Setup
 - Install dependencies `npm i`

## Run Normally
To begin, run `npm start` and VLC will launch with vlc-discord-rpc.

## Run Detached
`npm start detached` will launch seperate from VLC.

## Configuration (Optional)
[config/config.js](./config/config.js) may need to be modified if:
 - Your system uses an abnormal VLC install
 - You have manually configured your VLC web interface