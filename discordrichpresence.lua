--[[
-------------------------
Installation Instructions
-------------------------

Place this file in the corresponding folder and restart VLC or reload plugin extensions.

Linux:
  Current User: ~/.local/share/vlc/lua/extensions/
     All Users: /usr/lib/vlc/lua/extensions/

Windows:
  Current User: %APPDATA%\vlc\lua\extensions
     All Users: %ProgramFiles%\VideoLAN\VLC\lua\extensions\

Mac OS X:
  Current User: /Users/%your_name%/Library/Application Support/org.videolan.vlc/lua/extensions/
     All Users: /Applications/VLC.app/Contents/MacOS/share/lua/extensions/

--]]

function descriptor()
  return { title = "Discord Rich Presence",
    version = "0.1",
    author = "Pigpog",
    shortdesc = "Discord Rich Presence",
    description = "Displays what you are watching/listening to on your Discord profile.",
    capabilities = { "input-listener", "playing-listener" }
  }
end

-- Populated in activate method.
-- Can't require modules outside of methods.
local waitpid;
local exec;
local cmd;

-- Whether or not the child process exists
local active = false; 

-- CALLBACKS

-- Called when extension enabled ('ticked')
function activate()
  vlc.msg.dbg("DISCORD RICH PRESENCE ACTIVATED")
  exec = require("process").exec;
  waitpid = require("process").waitpid;
  start_presence()
  -- Feed it some data
  update_presence();  
end

-- Presumably called when vlc closes
function close()
  vlc.msg.dbg("Discord Rich Presence Close");
  stop_presence();
end

-- Called when extension disabled ('unticked')
function deactivate()
  vlc.msg.dbg("Discord Rich Presence Deactivate");
  stop_presence();
end

function input_changed()
  vlc.msg.dbg("Discord Rich Presence - input changed")
  -- if playing
  if(vlc.input:is_playing()) then
    if(active) then
      update_presence();
    else
      start_presence();
      update_presence();
    end
  -- if playback is stopped
  else
    stop_presence();
  end
end

function playing_changed(status)
  update_presence();
end

function meta_changed()
  -- this gets called really often
  -- like, really. this could happen a hundred times a second.
  -- vlc.msg.dbg("DISCORD RICH PRESENCE - Meta Changed");
end

function update_presence()
  local item=vlc.item or vlc.input.item()
  local prefix="DISCORD RICH PRESENCE - "
  cmd:stdin(item:metas()["title"] .. "\n" .. item:metas()["artist"] ..  " - " .. item:metas()["album"] ..  "\nvlc\n" .. (vlc.playlist or vlc.input.playlist()):status() .. "\n")

  -- DATA FOR USE IN FUTURE
  vlc.msg.dbg(prefix.. "Duration: ".. item:duration())
  local item=vlc.playlist or vlc.input.playlist()
  vlc.msg.dbg(prefix.. "Status: ".. item:status())
  local item=vlc.volume or vlc.input.volume()
  vlc.msg.dbg(prefix.. "Volume: ".. item:get()) 
  local item=vlc
  --vlc.msg.dbg(prefix.. "Time: ".. item:time()) 
  -- Read from stdout
  vlc.msg.dbg(cmd:stdout());
end

-- Starts the rich presence child-process
function start_presence()
  -- TODO: This path must change depending on OS
  cmd = exec(vlc.config.homedir() .. '/.local/share/vlc/lua/extensions/modules/send-presence', {})
  -- Give the program our Application ID
  cmd:stdin("410664151334256663")
  active = true;
end

-- Kills the rich presence child-process
function stop_presence()
  cmd:kill(9);
  waitpid(cmd:pid()); -- this prevents zombie processes
  active = false;
end
