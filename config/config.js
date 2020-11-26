// See CONFIGURATION.md for more information

module.exports = {
	// Overrides command used to launch VLC when in attached mode
	// If blank, defaults are used
  vlcPath: "",
  rpc: {
    id: '410664151334256663',
    updateInterval: 5000,
    sleepTime: 30000,
    // Show the album track number when applicable. Example: (2 of 10)
    displayTrackNumber: true,
    displayTimeRemaining: true,
    // If true, VLC will not be opened for you.
    // Note: You must set a password
    detached: false,
  },
  vlc: {
    // If blank, a random password is used
    password: '',
    port: 8080,
    address: 'localhost'
  },
};
