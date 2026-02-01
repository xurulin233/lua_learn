// game_server.js - 执行Lua游戏的Node.js服务器
const http = require('http');
const url = require('url');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// 检查Lua是否安装
function checkLuaInstalled() {
    return new Promise((resolve) => {
        exec('which lua', (error) => {
            if (error) {
                console.log('⚠️  Lua未安装，将使用JavaScript模拟模式');
                resolve(false);
            } else {
                console.log('✅  Lua已安装');
                resolve(true);
            }
        });
    });
}

// 执行Lua脚本
function executeLua(choice) {
    return new Promise((resolve) => {
        // 检查Lua是否存在
        exec('which lua', (error) => {
            if (error) {
                // Lua未安装，使用JavaScript模拟
                resolve(executeLuaInJS(choice));
            } else {
                // 执行真实的Lua脚本
                const command = `lua game.lua web ${choice}`;
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Lua执行错误:', error);
                        resolve(executeLuaInJS(choice));
                    } else {
                        resolve(stdout);
                    }
                });
            }
        });
    });
}

// JavaScript模拟Lua执行（备用方案）
function executeLuaInJS(choice) {
    let output = "===== 武侠之路 =====\n\n";
    
    const player = {
        attack: choice === "2" ? 120 : 100,
        defense: choice === "3" ? 120 : 100,
        skill: "基本剑法",
        role: choice === "1" ? "剑客" : choice === "2" ? "刀客" : "拳师"
    };
    
    const guard = { attack: 200, defense: 200 };
    
    output += `你选择了${player.role}！\n`;
    output += `攻击力: ${player.attack}  防御力: ${player.defense}\n\n`;
    
    output += "=== 挑战守卫 ===\n";
    output += "守卫: 小子，想通过这里？先过我这一关！\n";
    output += `守卫攻击力: ${guard.attack}  守卫防御力: ${guard.defense}\n\n`;
    output += "你冲向了守卫...\n\n";
    
    if (player.attack > guard.defense) {
        output += "成功击败了守卫！\n";
    } else {
        output += `失败！你的攻击力(${player.attack})不足以突破守卫的防御(${guard.defense})\n`;
        output += "守卫: 你还太嫩了！回去练练再来吧！\n";
    }
    
    output += "\n=== 寻找秘籍 ===\n";
    output += "你遇到了一位神秘老人...\n";
    output += "神秘老人: 年轻人，我看你资质不错，传授你独孤九剑吧！\n";
    output += "学会技能: 独孤九剑！\n\n";
    
    player.skill = "独孤九剑";
    player.attack += 150;
    
    output += "你的新属性:\n";
    output += `攻击力: ${player.attack}\n`;
    output += `防御力: ${player.defense}\n`;
    output += `技能: ${player.skill}\n\n`;
    
    output += "=== 再次挑战守卫 ===\n";
    output += "守卫: 又是你？还不死心？\n";
    output += "这次你使出了独孤九剑...\n\n";
    
    if (player.attack > guard.defense) {
        output += "独孤九剑威力惊人！轻松击败了守卫！\n";
        output += "守卫: 这...这是什么剑法？！我输了...\n";
    }
    
    output += "\n=== 走出新手村 ===\n";
    output += "你通过了守卫的考验，终于可以离开新手村了！\n";
    output += "前方是更广阔的江湖世界...\n\n";
    output += "====== 游戏结束 ======\n";
    output += "恭喜你完成了新手冒险！\n";
    
    return output;
}

// 生成HTML页面
function generateHTML(gameOutput, showChoices = false) {
    // 将输出转换为HTML
    const formattedOutput = gameOutput
        .replace(/=====.*?=====/g, '<h2>$&</h2>')
        .replace(/===.*?===/g, '<h3>$&</h3>')
        .replace(/守卫:/g, '<span class="guard">$&</span>')
        .replace(/神秘老人:/g, '<span class="oldman">$&</span>')
        .replace(/\n/g, '<br>');
    
    const choicesHTML = showChoices ? `
        <div class="choices">
            <h3>选择你的角色:</h3>
            <form method="GET" action="/play">
                <button type="submit" name="choice" value="1" class="choice-btn">剑客（攻击+0）</button>
                <button type="submit" name="choice" value="2" class="choice-btn">刀客（攻击+20）</button>
                <button type="submit" name="choice" value="3" class="choice-btn">拳师（防御+20）</button>
            </form>
        </div>
    ` : `
        <div class="restart">
            <a href="/" class="restart-btn">重新开始游戏</a>
        </div>
    `;
    
    return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lua文字游戏 - 武侠之路</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Microsoft YaHei', 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
                min-height: 100vh;
                padding: 20px;
            }
            
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            
            h1 {
                text-align: center;
                color: #2c3e50;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 3px solid #3498db;
            }
            
            .game-output {
                background: #f8f9fa;
                border: 2px solid #e9ecef;
                border-radius: 10px;
                padding: 25px;
                margin: 25px 0;
                font-family: 'Courier New', monospace;
                line-height: 1.8;
                font-size: 16px;
                min-height: 400px;
                overflow-y: auto;
            }
            
            .game-output h2 {
                color: #e74c3c;
                text-align: center;
                margin: 15px 0;
            }
            
            .game-output h3 {
                color: #3498db;
                margin: 10px 0;
            }
            
            .game-output .guard {
                color: #c0392b;
                font-weight: bold;
            }
            
            .game-output .oldman {
                color: #8e44ad;
                font-weight: bold;
            }
            
            .choices {
                text-align: center;
                margin: 30px 0;
            }
            
            .choice-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 15px 25px;
                margin: 10px;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                display: inline-block;
                text-decoration: none;
            }
            
            .choice-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
            }
            
            .restart {
                text-align: center;
                margin-top: 30px;
            }
            
            .restart-btn {
                background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
                color: white;
                padding: 15px 30px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                display: inline-block;
            }
            
            .footer {
                text-align: center;
                margin-top: 30px;
                color: #666;
                font-size: 14px;
                padding-top: 20px;
                border-top: 1px solid #eee;
            }
            
            .mode-info {
                background: #e3f2fd;
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🗡️ 武侠之路 - Lua文字游戏 🏮</h1>
            
            <div class="mode-info" id="modeInfo">
                <!-- 模式信息将通过JavaScript动态显示 -->
            </div>
            
            <div class="game-output" id="gameOutput">
                ${formattedOutput}
            </div>
            
            ${choicesHTML}
            
            <div class="footer">
                <p>🎮 游戏逻辑由 Lua 脚本驱动 | 服务器端渲染 | 无需浏览器插件</p>
                <p>📁 Lua脚本: game.lua | 服务器: game_server.js</p>
            </div>
        </div>
        
        <script>
            // 自动滚动到底部
            window.onload = function() {
                const output = document.getElementById('gameOutput');
                output.scrollTop = output.scrollHeight;
                
                // 显示当前模式
                const modeInfo = document.getElementById('modeInfo');
                const outputText = output.textContent || output.innerText;
                
                if (outputText.includes('JavaScript模拟')) {
                    modeInfo.innerHTML = '🔧 当前模式: JavaScript模拟 (Lua未安装)';
                    modeInfo.style.background = '#fff3cd';
                    modeInfo.style.color = '#856404';
                } else {
                    modeInfo.innerHTML = '✅ 当前模式: 真实Lua执行';
                    modeInfo.style.background = '#d4edda';
                    modeInfo.style.color = '#155724';
                }
            };
        </script>
    </body>
    </html>
    `;
}

// 创建HTTP服务器
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    
    try {
        if (pathname === '/') {
            // 首页：显示游戏开始
            const luaInstalled = await checkLuaInstalled();
            const welcomeText = luaInstalled 
                ? "===== 武侠之路 =====\n\n欢迎来到Lua文字游戏！\n请选择你的角色开始冒险。"
                : "===== 武侠之路 =====\n\n（Lua未安装，使用JavaScript模拟模式）\n请选择你的角色开始冒险。";
            
            res.end(generateHTML(welcomeText, true));
            
        } else if (pathname === '/play') {
            // 执行游戏
            const choice = parsedUrl.query.choice || '1';
            console.log(`执行游戏，选择: ${choice}`);
            
            const gameOutput = await executeLua(choice);
            res.end(generateHTML(gameOutput, false));
            
        } else {
            // 404页面
            res.end(generateHTML("404 - 页面未找到\n\n请访问首页开始游戏", true));
        }
    } catch (error) {
        console.error('服务器错误:', error);
        res.end(generateHTML(`服务器错误: ${error.message}\n\n请刷新重试`, true));
    }
});

// 启动服务器
server.listen(PORT, async () => {
    console.log('='.repeat(50));
    console.log('🚀 Lua文字游戏服务器启动成功！');
    console.log(`🌐 请访问: http://localhost:${PORT}`);
    console.log('='.repeat(50));
    console.log('');
    
    // 检查Lua安装状态
    const luaInstalled = await checkLuaInstalled();
    if (!luaInstalled) {
        console.log('💡 建议安装Lua以获得最佳体验:');
        console.log('  Ubuntu/Debian: sudo apt install lua5.3');
        console.log('  CentOS/RHEL:   sudo yum install lua');
        console.log('  Mac:           brew install lua');
        console.log('');
    }
    
    console.log('📁 项目文件:');
    console.log('  • game.lua        - Lua游戏脚本');
    console.log('  • game_server.js  - Node.js服务器');
    console.log('  • package.json    - 项目配置');
    console.log('');
    console.log('🛑 按 Ctrl+C 停止服务器');
    console.log('='.repeat(50));
});

// 处理退出信号
process.on('SIGINT', () => {
    console.log('\n🛑 服务器已停止');
    process.exit(0);
});
