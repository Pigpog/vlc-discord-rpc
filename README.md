# vlc-discord-rpc (Lua version!) (Linux only! (for now))
This is an exciting update to the vlc-discord-rpc project. This is the very first time i'm sharing this code, so don't be suprised if it doesn't immediately work on your system. Almost all of the steps below will be unneeded when I start creating releases. There are components that are currently configured to only work on Linux.

## Installation instructions
### General
For now you can use the [aioinstall.sh](aioinstall.sh) script to install, it will do the
following:
1. Check for build dependencies
2. Check out the Source Code to be compiled
3. Compile everything
4. Move the binaries into place

### Manual
#### Make sure the build dependencies are installed
* git
* luarocks
* lua-devel
* make
* cmake
* gcc-c++

#### Check out the Source Code
```
git clone --recurse-submodules https://github.com/Pigpog/vlc-discord-rpc.git --branch lua
```
#### Compile lua-process
Change into the source directory, replace the original Makefile with ours and
compile
```
cd vlc-discord-rpc/lua-process/
luarocks make --local
```
The resulting `process.so` file needs to be placed in the VLC modules
directory:
```
mkdir -p ~/.local/share/vlc/lua/extensions/modules
cp process.so ~/.local/share/vlc/lua/extensions/modules/
```
#### Compile discord-rich-presence-cli
This requires `discord-rpc` to be present, if there is no packaged version for
your Distribution you can download the latest release [here](https://github.com/discordapp/discord-rpc/releases),
put the files from `linux-dynamic/lib` in `/usr/lib`, `linux-dynamic/include` in `/usr/include` and run `ldconfig`.

Change into the source directory, compile and place the `send-presence` binary in the VLC modules directory:
```
cd vlc-discord-rpc/discord-rich-presence-cli/
cmake .
make
cp send-presence ~/.local/share/vlc/lua/extensions/modules/
```
#### Install the extension
Place the `discordrichpresence.lua` file in the VLC extension directory:
```
cp vlc-discord-rpc/discordrichpresence.lua ~/.local/share/vlc/lua/extensions/
```
### openSUSE
Someone already [built packages](https://build.opensuse.org/project/show/home:tux93:vlc-discord-rpc) for the extension on openSUSE, the only manual
step that needs to be done there is [compiling lua-process](#compile-lua-process), with one difference:
the `process.so` file needs to be placed in `/usr/lib64/lua/5.3/` instead!
(Note: the `luarocks` package is called `lua53-luarocks`)

After that it's as simple as adding the repository and installing the package,
Replace `$VERSION` with `Tumbleweed` or `Leap_15.2` depending on what you use:
```
sudo zypper addrepo --refresh https://download.opensuse.org/repositories/home:/tux93:/vlc-discord-rpc/openSUSE_$VERSION/ vlc-discord-rpc
sudo zypper in vlc-discord-rpc
```
### Ready to run!
Open VLC media player. The extension should be listed as an option in the View menu of VLC. Play a song, and tick the box. See what happens!

