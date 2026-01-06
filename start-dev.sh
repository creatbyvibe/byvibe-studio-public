#!/bin/bash

# Studio 本地预览启动脚本

echo "🚀 启动 Studio 本地预览服务器..."
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo ""

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
    echo ""
fi

# 清理旧进程
echo "🧹 清理旧进程..."
pkill -f "next dev" 2>/dev/null
sleep 2

# 清理端口
if lsof -ti:3000 &> /dev/null; then
    echo "🔓 释放端口 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 1
fi

# 清理缓存
echo "🧹 清理构建缓存..."
rm -rf .next
echo ""

# 检查环境变量
if [ ! -f ".env.local" ]; then
    echo "⚠️  警告: .env.local 文件不存在"
    echo "   Studio 功能可能需要以下环境变量："
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - GEMINI_API_KEY"
    echo ""
    echo "   如果只是预览 UI，可以暂时不配置"
    echo ""
fi

# 启动服务器
echo "🚀 启动开发服务器..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📍 访问地址:"
echo "    首页:      http://localhost:3000"
echo "    Studio:    http://localhost:3000/studio"
echo ""
echo "  💡 提示:"
echo "    - 按 Ctrl+C 停止服务器"
echo "    - 如果端口被占用，会自动使用下一个可用端口"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev
