#!/bin/bash
echo "🚀 快速启动 Studio 预览..."
cd /Users/wubinyuan/.cursor/worktrees/byvibe-hero/vwt
pkill -f "next dev" 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
rm -rf .next
npm run dev
