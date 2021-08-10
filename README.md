# vlc-discord-rpc

Discord rich presence for VLC media player.

![Example](./example.png)

Join us on [Discord](https://discord.gg/3Fu6KHd).

## Setup

### Requirements

- [Node.JS and NPM](https://nodejs.org/en/) (unless you're using a bundle release)
- [VLC](https://www.videolan.org/index.html)
- [Discord desktop client](https://discordapp.com/)

### Steps

 1. [Download the latest release for your platform](https://github.com/Pigpog/vlc-discord-rpc/releases)
  - If you download a bundle release, you will not need to install Node.JS/NPM
 2. Unzip the file
 3. Launch the start file
 4. Play media in the VLC window that opens

## Configuration

Configuration is done by editing the [config/config.js](./config/config.js) file.
Each option is explained in a comment above it.

For advanced features, see [ADVANCED.md](./ADVANCED.md).

## Limitations

 - When running multiple concurrent instances, only the first-opened instance of VLC will have a rich presence
 - The rich presence cannot display album art
 - This program does NOT allow you to stream media to others

