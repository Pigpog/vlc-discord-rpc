const { spawn } = require('child_process');
const vlc = require('vlc.js');
const format = require('../../src/rpc/format.js');
const config = require('../../config/config.js');

const client = new vlc.Client(config.vlc);
const args = ['--extraintf', 'http', '--http-host', config.vlc.address, '--http-password', config.vlc.password, '--http-port', config.vlc.port];
let pid = '';

beforeAll(() => {
  const instance = spawn(config.startupCommands[process.platform], args);
  pid += instance.pid;
  return instance;
});

afterAll(() => {
  process.kill(pid, 9);
});

test('Testing format.js', () => {
  client.getStatus()
    .then(async (status) => {
      const formatted = await format(status);
      expect(formatted.state).any(String);
      expect(formatted.details).any(String);
      expect(formatted.largeImageKey).any(String);
      expect(formatted.smallImageKey).any(String);``
      expect(formatted.instance).any(Boolean);
    })
})
