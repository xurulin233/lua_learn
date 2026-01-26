-- simple_power_control.lua
-- 通过SSH控制单个AP的发射功率

local AP_HOST = "192.168.70.182"  -- AP的IP地址
local AP_USER = "root"         -- SSH用户名
local AP_IFACE = "ath0"        -- 无线接口名
local AP_PASSWORD = "password" -- SSH密码（如果使用密码登录）
local TARGET_MAC = "12:e0:03:f5:3c:2f"


-- 方法1: 使用sshpass（需要先安装）
function set_power_with_sshpass(power_dbm)
    -- 安装sshpass: opkg update && opkg install sshpass
    local cmd = string.format(
        'sshpass -p "%s" ssh -o StrictHostKeyChecking=no %s@%s "iwconfig %s txpower %d"',
        AP_PASSWORD, AP_USER, AP_HOST, AP_IFACE, power_dbm
    )
    
    print("Setting power to " .. power_dbm .. " dBm")
    local result = os.execute(cmd)
    if result then
        print("✓ Success")
        return true
    else
        print("✗ Failed")
        return false
    end
end



-- 获取当前功率
function get_current_power()

    local cmd = string.format(
        'sshpass -p "%s" ssh -o StrictHostKeyChecking=no %s@%s "iwconfig %s | grep Tx-Power"',
        AP_PASSWORD, AP_USER, AP_HOST, AP_IFACE, power_dbm
    )
    local f = io.popen(cmd)
    if not f then return nil end
    
    local output = f:read("*a")
    f:close()
    
    local power = output:match("Tx%-Power[=:](%d+)")
    return tonumber(power)
end


local function get_sta_rssi(target_mac)
    local cmd = string.format(
        'sshpass -p "%s" ssh -o StrictHostKeyChecking=no %s@%s "wlanconfig %s list sta | grep -i %s"',
        AP_PASSWORD, AP_USER, AP_HOST, AP_IFACE, TARGET_MAC
    )
    
    local f = io.popen(cmd)
    if not f then
        print("Failed to execute command")
        return nil
    end
    
    local line = f:read("*a")
    f:close()
    
    if line and #line > 0 then
       -- print("Raw output: " .. line)
        
        -- 分割所有字段
        local fields = {}
        for field in line:gmatch("%S+") do
            table.insert(fields, field)
        end
        --[[
        -- 打印所有字段用于调试
        print("Total fields: " .. #fields)
        for i, field in ipairs(fields) do
            print(i .. ": " .. field)
        end
        ]]
        -- RSSI 是第6个字段（索引6，因为Lua从1开始）
        if #fields >= 6 then
            local rssi_str = fields[6]
            local rssi = tonumber(rssi_str)
            if rssi then
                return rssi
            else
                print("Cannot convert to number: " .. rssi_str)
            end
        else
            print("Not enough fields")
        end
    else
        print("No output or client not found")
    end
    
    return nil
end

-- 测试不同功率
function test_power_levels()
    local power_levels = {1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20}
    
    for _, power in ipairs(power_levels) do
        set_power_with_sshpass(power)
        os.execute("sleep 2")  -- 等待生效
        
        local current = get_current_power()
        print("Set: " .. power .. " dBm, Actual: " .. (current or "unknown") .. " dBm")

        local rssi = get_sta_rssi(TARGET_MAC)
        if rssi then
            print("Client " .. TARGET_MAC .. " RSSI: " .. rssi .. " dBm")
        else
            print("Client " .. TARGET_MAC .. " not found or RSSI not available")
        end
        os.execute("sleep 1")
    end
end






-- 主程序
print("=== Single AP Power Control ===")
print("AP: " .. AP_HOST)
print("Interface: " .. AP_IFACE)

-- 设置特定功率
set_power_with_sshpass(20)

-- 获取并显示当前功率
local current = get_current_power()
if current then
    print("Current power: " .. current .. " dBm")
end

test_power_levels()