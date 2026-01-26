print("Hello from OpenWrt Lua!")
print("Current time:", os.date())

local f = io.popen("uname -a")
local system_info = f:read("*a")
f:close()
print("System:", system_info)