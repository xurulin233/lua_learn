-- game.lua - 完整的文字对话游戏
-- 游戏开始 -> 选择剑客 -> 挑战守卫 -> 挑战失败 -> 学习独孤九剑 -> 再次挑战 -> 挑战成功 -> 走出新手村 -> 游戏结束

print("===== 武侠之路 =====\n")

-- 角色选择函数
function select_role()
    print("请选择你的角色:")
    print("1. 剑客（攻击+0）")
    print("2. 刀客（攻击+20）")
    print("3. 拳师（防御+20）")
    
    io.write("请输入选择 (1-3): ")
    local choice = tonumber(io.read()) or 1
    
    local player = {
        attack = 100,
        defense = 100,
        skill = "基本剑法",
        role = "剑客"
    }
    
    if choice == 2 then
        player.attack = 120
        player.role = "刀客"
        print("\n你选择了刀客！攻击力+20")
    elseif choice == 3 then
        player.defense = 120
        player.role = "拳师"
        print("\n你选择了拳师！防御力+20")
    else
        print("\n你选择了剑客！")
    end
    
    print("攻击力: " .. player.attack .. "  防御力: " .. player.defense)
    return player
end

-- 第一次挑战守卫
function first_challenge(player)
    local guard = {attack = 200, defense = 200}
    
    print("\n=== 挑战守卫 ===")
    print("守卫: 小子，想通过这里？先过我这一关！")
    print("守卫攻击力: " .. guard.attack .. "  守卫防御力: " .. guard.defense)
    print("\n你冲向了守卫...")
    
    if player.attack > guard.defense then
        print("成功击败了守卫！")
        return true
    else
        print("失败！你的攻击力(" .. player.attack .. ")不足以突破守卫的防御(" .. guard.defense .. ")")
        print("守卫: 你还太嫩了！回去练练再来吧！")
        return false
    end
end

-- 学习独孤九剑
function learn_skill(player)
    print("\n=== 寻找秘籍 ===")
    print("你遇到了一位神秘老人...")
    print("神秘老人: 年轻人，我看你资质不错，传授你独孤九剑吧！")
    print("学会技能: 独孤九剑！")
    
    player.skill = "独孤九剑"
    player.attack = player.attack + 150
    
    print("\n你的新属性:")
    print("攻击力: " .. player.attack)
    print("防御力: " .. player.defense)
    print("技能: " .. player.skill)
    
    return player
end

-- 第二次挑战守卫
function second_challenge(player)
    local guard = {attack = 200, defense = 200}
    
    print("\n=== 再次挑战守卫 ===")
    print("守卫: 又是你？还不死心？")
    print("这次你使出了独孤九剑...")
    
    if player.attack > guard.defense then
        print("独孤九剑威力惊人！轻松击败了守卫！")
        print("守卫: 这...这是什么剑法？！我输了...")
        return true
    else
        print("竟然还是打不过守卫...")
        return false
    end
end

-- 游戏结束
function game_end()
    print("\n=== 走出新手村 ===")
    print("你通过了守卫的考验，终于可以离开新手村了！")
    print("前方是更广阔的江湖世界...")
    print("\n====== 游戏结束 ======")
    print("恭喜你完成了新手冒险！")
end

-- 主游戏流程
function main_game()
    local player = select_role()
    first_challenge(player)
    player = learn_skill(player)
    second_challenge(player)
    game_end()
end

-- 启动游戏
if arg[1] == "web" then
    -- Web模式：从命令行参数获取选择
    local choice = arg[2] or "1"
    local player = {
        attack = choice == "2" and 120 or (choice == "3" and 100 or 100),
        defense = choice == "3" and 120 or 100,
        skill = "基本剑法",
        role = choice == "2" and "刀客" or (choice == "3" and "拳师" or "剑客")
    }
    
    print("===== 武侠之路 =====")
    print("\n你选择了" .. player.role .. "！")
    print("攻击力: " .. player.attack .. "  防御力: " .. player.defense)
    
    local guard = {attack = 200, defense = 200}
    
    print("\n=== 挑战守卫 ===")
    print("守卫: 小子，想通过这里？先过我这一关！")
    print("守卫攻击力: " .. guard.attack .. "  守卫防御力: " .. guard.defense)
    print("\n你冲向了守卫...")
    
    if player.attack > guard.defense then
        print("成功击败了守卫！")
    else
        print("失败！你的攻击力(" .. player.attack .. ")不足以突破守卫的防御(" .. guard.defense .. ")")
        print("守卫: 你还太嫩了！回去练练再来吧！")
    end
    
    print("\n=== 寻找秘籍 ===")
    print("你遇到了一位神秘老人...")
    print("神秘老人: 年轻人，我看你资质不错，传授你独孤九剑吧！")
    print("学会技能: 独孤九剑！")
    
    player.skill = "独孤九剑"
    player.attack = player.attack + 150
    
    print("\n你的新属性:")
    print("攻击力: " .. player.attack)
    print("防御力: " .. player.defense)
    print("技能: " .. player.skill)
    
    print("\n=== 再次挑战守卫 ===")
    print("守卫: 又是你？还不死心？")
    print("这次你使出了独孤九剑...")
    
    if player.attack > guard.defense then
        print("独孤九剑威力惊人！轻松击败了守卫！")
        print("守卫: 这...这是什么剑法？！我输了...")
    end
    
    print("\n=== 走出新手村 ===")
    print("你通过了守卫的考验，终于可以离开新手村了！")
    print("前方是更广阔的江湖世界...")
    print("\n====== 游戏结束 ======")
    print("恭喜你完成了新手冒险！")
else
    -- 本地模式：交互式
    main_game()
end
