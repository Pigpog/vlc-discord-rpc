const { spawn } = require('child_process');
const diff = require('../../src/vlc/diff.js');
const config = require('../../config/config.js');

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


test('Testing diff.js', () => {
  diff((status, change) => {
    expect(status).any(Object);
    expect(change).any(Boolean);
  });
});
