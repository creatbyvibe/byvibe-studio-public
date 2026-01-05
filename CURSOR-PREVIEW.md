# 在 Cursor 中预览项目

## 🎯 方法 1：使用 Cursor 内置预览（推荐）

### 步骤：

1. **确保开发服务器正在运行**
   ```bash
   npm run dev
   ```

2. **在 Cursor 中打开预览**
   - 按 `Cmd+Shift+P` (Mac) 或 `Ctrl+Shift+P` (Windows/Linux)
   - 输入 "Simple Browser" 或 "Preview"
   - 选择 "Simple Browser: Show"
   - 输入地址：`http://localhost:3000`

3. **或者使用快捷键**
   - 在 Cursor 中，可以直接在地址栏输入 `http://localhost:3000`
   - 或者右键点击终端中的链接，选择 "Open in Simple Browser"

## 🎯 方法 2：使用 Live Preview 扩展

### 安装扩展：

1. 在 Cursor 中按 `Cmd+Shift+X` (Mac) 或 `Ctrl+Shift+X` (Windows/Linux)
2. 搜索 "Live Preview"
3. 安装 Microsoft 的 "Live Preview" 扩展

### 使用：

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **打开预览**
   - 按 `Cmd+Shift+P` (Mac) 或 `Ctrl+Shift+P` (Windows/Linux)
   - 输入 "Live Preview: Show Preview"
   - 选择 "Live Preview: Show Preview (External Browser)"
   - 输入地址：`http://localhost:3000`

## 🎯 方法 3：使用 Cursor 的端口转发（如果支持）

如果 Cursor 支持端口转发功能：

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **在 Cursor 中**
   - 查看底部状态栏，可能会显示端口转发选项
   - 或者使用命令面板搜索 "Port Forwarding"

## 🎯 方法 4：使用内置终端预览

### 使用 curl 或 wget 查看 HTML：

```bash
# 在 Cursor 终端中运行
curl http://localhost:3000
```

### 使用 lynx（文本浏览器）：

```bash
# 安装 lynx（如果未安装）
brew install lynx  # macOS
# 或
sudo apt-get install lynx  # Linux

# 使用 lynx 预览
lynx http://localhost:3000
```

## 🎯 方法 5：使用 Cursor 的 Webview（最简单）

### 步骤：

1. **确保服务器运行**
   ```bash
   npm run dev
   ```

2. **在 Cursor 中**
   - 打开命令面板：`Cmd+Shift+P` (Mac) 或 `Ctrl+Shift+P` (Windows/Linux)
   - 输入 "Simple Browser"
   - 选择 "Simple Browser: Show"
   - 在地址栏输入：`http://localhost:3000`

## 📋 快速命令

### 一键启动并预览：

创建一个脚本 `preview.sh`：

```bash
#!/bin/bash
# 启动开发服务器
npm run dev &
# 等待服务器启动
sleep 3
# 在 Cursor 中打开预览（需要手动操作）
echo "✅ 服务器已启动，访问 http://localhost:3000"
echo "在 Cursor 中按 Cmd+Shift+P，输入 'Simple Browser' 打开预览"
```

## 🔧 配置 Cursor 自动预览

### 创建任务配置：

在 `.vscode/tasks.json` 中：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Server",
      "type": "shell",
      "command": "npm run dev",
      "isBackground": true,
      "problemMatcher": {
        "pattern": {
          "regexp": "^$",
          "file": 1,
          "location": 2,
          "message": 3
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": ".",
          "endsPattern": "Ready"
        }
      }
    }
  ]
}
```

## 💡 推荐方式

**最简单的方法**：

1. 运行 `npm run dev` 启动服务器
2. 在 Cursor 中按 `Cmd+Shift+P` (Mac) 或 `Ctrl+Shift+P` (Windows/Linux)
3. 输入 "Simple Browser"
4. 选择 "Simple Browser: Show"
5. 输入 `http://localhost:3000`

这样就能在 Cursor 内置的简单浏览器中预览你的网站了！

## 🎨 预览效果

- ✅ 实时预览（代码修改后自动刷新）
- ✅ 无需打开外部浏览器
- ✅ 在编辑器内直接查看
- ✅ 支持调试和开发工具

---

**提示**：如果 Simple Browser 不可用，可以安装 "Live Preview" 扩展。
