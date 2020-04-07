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

function meta_changed()
  -- this gets called really often
  -- like, really. this could happen a hundred times a second.
  -- it complains when we dont have this callback though
  -- vlc.msg.dbg("DISCORD RICH PRESENCE - Meta Changed");
end

function playing_changed(status)
  update_presence();
end

function get_elapsed_time()
  local input = vlc.object.input()
  --VLC 3 : elapsed_time must be divided by 1000000 -> to seconds
  --VLC2.1+ : Don't need the division -> already in seconds
  local elapsed_time = math.floor(vlc.var.get(input, "time") / 1000000 * vlc.var.get(input,"rate"))

  return elapsed_time
end

function update_presence()
  local item=vlc.item or vlc.input.item()
  local prefix="DISCORD RICH PRESENCE - "
  cmd:stdin(item:metas()["title"] .. "\n" .. item:metas()["artist"] ..  " - " .. item:metas()["album"] ..  "\nvlc\n" .. (vlc.playlist or vlc.input.playlist()):status() .. "\n" .. math.floor(item:duration() - get_elapsed_time()) + os.time() .. "\n")

  -- DEBUG DATA
  vlc.msg.dbg(prefix.. "Duration: ".. item:duration())
  local item=vlc.playlist or vlc.input.playlist()
  vlc.msg.dbg(prefix.. "Status: ".. item:status())
  local item=vlc.volume or vlc.input.volume()
  vlc.msg.dbg(prefix.. "Volume: ".. item:get()) 
  local item=vlc
  vlc.msg.dbg(prefix.. "Time: ".. get_elapsed_time()) 
  vlc.msg.dbg(prefix .. "Current Time:" .. os.time())
  

  -- Read from stdout
  vlc.msg.dbg(cmd:stdout());
end

-- Starts the rich presence child-process
function start_presence()
  -- TODO: This path must change depending on OS
  cmd = exec(vlc.config.homedir() .. '/.local/share/vlc/lua/extensions/modules/send-presence', {})
  cmd:stdin("410664151334256663\n")
  active = true;
end

-- Kills the rich presence child-process
function stop_presence()
  cmd:kill(9);
  waitpid(cmd:pid()); -- this prevents zombie processes
  active = false;
end