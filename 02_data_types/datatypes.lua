-- temperature_converter.lua
-- Simple Lua script showing basic data types

print("=== Temperature Converter ===")

-- 1. Numbers
local celsius = 25.5
local fahrenheit = (celsius * 9/5) + 32

print("Celsius:", celsius)
print("Fahrenheit:", fahrenheit)

-- 2. Strings
local city = "New York"
print("City:", city)

-- 3. Table (array)
print("\nTemperature History:")
local temps = {20, 22, 25, 23, 24}
for i, temp in ipairs(temps) do
    print("Day " .. i .. ": " .. temp .. "°C")
end

-- 4. Table (dictionary)
print("\nCity Temperatures:")
local city_temps = {
    ["NY"] = 25,
    ["LA"] = 28,
    ["TX"] = 32
}

city_temps["FL"] = 30  -- Add new

for city_code, temp in pairs(city_temps) do
    print(city_code .. ": " .. temp .. "°C")
end

-- 5. Boolean
local is_hot = celsius > 30
print("\nIs it hot?", is_hot)

-- 6. Function
function convert_to_f(c)
    return (c * 9/5) + 32
end

print("\n30°C = " .. convert_to_f(30) .. "°F")