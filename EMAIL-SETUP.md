# 欢迎邮件功能设置指南

## ✅ 已实现的功能

### 1. 欢迎邮件自动发送
- ✅ 用户加入等待列表后自动发送欢迎邮件
- ✅ 使用 Resend API 发送邮件（支持 Edge Runtime）
- ✅ 精美的 HTML 邮件模板
- ✅ 个性化内容（包含用户名称）
- ✅ 邮件发送失败不影响主流程

### 2. 邮件模板
- ✅ 响应式 HTML 设计
- ✅ 深色主题（与网站风格一致）
- ✅ 包含产品介绍和下一步指引
- ✅ 品牌标识和链接

## 🔧 配置步骤

### 方法 1：使用 Resend（推荐）

#### 1. 注册 Resend 账户
1. 访问：https://resend.com
2. 注册账户（免费 tier 每月 3,000 封邮件）
3. 验证域名（可选，但推荐）

#### 2. 获取 API Key
1. 登录 Resend Dashboard
2. 进入 **API Keys** 页面
3. 创建新的 API Key
4. 复制 API Key

#### 3. 配置环境变量
在 Cloudflare Pages Dashboard 中添加：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `RESEND_API_KEY` | 你的 Resend API Key | Production + Preview |

#### 4. 配置发件人域名（可选但推荐）
1. 在 Resend Dashboard 中添加你的域名
2. 按照提示配置 DNS 记录
3. 验证域名后可以使用 `welcome@yourdomain.com` 作为发件人

### 方法 2：使用 Supabase Edge Functions（备选）

如果不想使用 Resend，可以：
1. 创建 Supabase Edge Function
2. 使用 Supabase 的邮件服务
3. 修改 `/app/api/send-email/route.ts` 调用 Supabase Function

### 方法 3：使用其他邮件服务

可以替换为其他支持 Edge Runtime 的邮件服务：
- SendGrid
- Mailgun
- AWS SES
- Postmark

## 📧 邮件模板内容

欢迎邮件包含：
- ✅ 个性化问候（使用用户名称）
- ✅ 产品介绍
- ✅ 下一步指引
- ✅ 访问网站按钮
- ✅ 联系信息
- ✅ 品牌标识

## 🎨 邮件模板自定义

编辑 `lib/email/templates.ts` 文件来自定义：
- 邮件主题
- HTML 内容
- 样式和颜色
- 链接和按钮

## ⚙️ 工作原理

1. **用户提交等待列表**
   - 调用 `/api/waitlist` POST 接口
   - 数据保存到 Supabase

2. **自动发送邮件**
   - 成功保存后，调用 `/api/send-email` 接口
   - 使用 Resend API 发送邮件
   - 邮件发送失败不影响主流程

3. **用户收到邮件**
   - 欢迎邮件发送到用户邮箱
   - 包含个性化内容和产品介绍

## 🔍 测试

### 本地测试
1. 设置 `RESEND_API_KEY` 环境变量
2. 运行 `npm run dev`
3. 提交等待列表表单
4. 检查邮箱是否收到邮件

### 生产环境测试
1. 确保 Cloudflare Pages 已配置 `RESEND_API_KEY`
2. 提交等待列表表单
3. 检查邮箱是否收到邮件

## ⚠️ 注意事项

1. **API Key 安全**
   - 不要将 API Key 提交到代码仓库
   - 只在 Cloudflare Pages 环境变量中配置

2. **邮件发送限制**
   - Resend 免费 tier：每月 3,000 封
   - 超出限制需要升级计划

3. **域名验证**
   - 未验证域名可能进入垃圾邮件
   - 建议验证域名以提高送达率

4. **错误处理**
   - 邮件发送失败不会影响等待列表注册
   - 错误会记录在控制台日志中

## 📝 环境变量清单

需要在 Cloudflare Pages 配置：

| 变量名 | 用途 | 必需 |
|--------|------|------|
| `RESEND_API_KEY` | Resend API 密钥 | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ |

## 🚀 部署后检查

1. **验证环境变量**
   - 确保 `RESEND_API_KEY` 已配置
   - 检查 Production 和 Preview 环境

2. **测试邮件发送**
   - 提交测试邮箱到等待列表
   - 检查是否收到欢迎邮件

3. **检查日志**
   - 查看 Cloudflare Pages 构建日志
   - 检查是否有邮件发送错误

## ✨ 邮件预览

欢迎邮件包含：
- 品牌标识和标题
- 个性化问候
- 产品介绍
- 下一步指引
- 访问网站按钮
- 联系信息和页脚

## 📚 参考

- [Resend 文档](https://resend.com/docs)
- [Resend API 参考](https://resend.com/docs/api-reference/emails/send-email)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## 🎯 总结

欢迎邮件功能已实现：
- ✅ 自动发送欢迎邮件
- ✅ 精美的 HTML 模板
- ✅ 个性化内容
- ✅ 错误处理完善

只需配置 `RESEND_API_KEY` 即可使用！
