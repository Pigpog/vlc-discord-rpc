// See CONFIGURATION.md for more information

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
    // Show the album track number when applicable. Example: (2 of 10)
    displayTrackNumber: true,
    displayTimeRemaining: true,
    // Launch VLC seperately
    detached: false,
  },
  vlc: {
    // Enter password between the semi-quotes
    password: '' || randomPass(),
    port: 9090,
    address: 'localhost'
  },
};
