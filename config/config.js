function randomPass() {
  return Math.random()
    .toString(36)
    .slice(-8);
}

module.exports = {
  startupCommands: {
    win32: 'C:/Program Files/VideoLAN/VLC/vlc.exe',
    linux: '/usr/bin/vlc',
    unix: '/usr/bin/vlc',
    darwin: '/Applications/VLC.app/Contents/MacOS/VLC',
  },
  rpc: {
    id: '410664151334256663',
    updateInterval: 5000,
    sleepTime: 30000,
  },
  vlc: {
    password: '' || randomPass(), // Enter password between the semi-quotes
    port: 9090,
    address: 'localhost',
    detached: false, // Launch VLC seperately
  },
};
