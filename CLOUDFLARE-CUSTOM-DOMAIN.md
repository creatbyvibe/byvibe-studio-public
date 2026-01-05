# Cloudflare Pages 自定义域名配置指南

## 📋 前置条件

1. 拥有一个域名（例如：`byvibe.ai`）
2. 域名已在 Cloudflare 管理（或准备将域名 DNS 迁移到 Cloudflare）
3. Cloudflare Pages 项目已成功部署

## 🚀 配置步骤

### 步骤 1: 在 Cloudflare Pages 中添加自定义域名

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** 部分
3. 选择你的项目（`byvibe-studio-public`）
4. 点击 **Custom domains** 标签页
5. 点击 **Set up a custom domain** 按钮
6. 输入你的域名（例如：`byvibe.ai` 或 `www.byvibe.ai`）
7. 点击 **Continue**

### 步骤 2: 配置 DNS 记录

Cloudflare 会自动检测你的域名 DNS 配置。有两种情况：

#### 情况 A: 域名已在 Cloudflare 管理

如果域名已经在 Cloudflare 管理，系统会自动配置 DNS 记录，你只需要：

1. 确认 DNS 记录已自动创建（CNAME 记录指向 `pages.dev`）
2. 等待 DNS 传播（通常几分钟到几小时）

#### 情况 B: 域名不在 Cloudflare 管理

如果域名不在 Cloudflare，你需要：

1. **将域名添加到 Cloudflare**：
   - 在 Cloudflare Dashboard 点击 **Add a Site**
   - 输入你的域名
   - 按照向导完成域名添加（需要更新域名的 nameservers）

2. **手动添加 DNS 记录**：
   - 进入域名的 **DNS** 设置
   - 添加 CNAME 记录：
     - **Name**: `@` (根域名) 或 `www` (子域名)
     - **Target**: Cloudflare Pages 提供的地址（例如：`your-project.pages.dev`）
     - **Proxy status**: 已代理（橙色云朵）

### 步骤 3: SSL/TLS 配置

Cloudflare 会自动为自定义域名配置 SSL 证书：

1. 进入域名的 **SSL/TLS** 设置
2. 确保 SSL/TLS encryption mode 设置为 **Full** 或 **Full (strict)**
3. 等待证书自动颁发（通常几分钟到几小时）

### 步骤 4: 验证配置

1. 等待 DNS 传播完成（可以使用 `dig` 或在线工具检查）
2. 访问你的自定义域名（例如：`https://byvibe.ai`）
3. 确认网站正常加载
4. 检查 SSL 证书是否生效（浏览器地址栏应显示锁图标）

## 🔧 高级配置

### 配置重定向规则

如果需要将 `www` 重定向到根域名（或反之），可以在 Cloudflare Pages 的 **Functions** 中配置，或使用 Cloudflare 的 **Page Rules**。

### 配置环境变量

确保在 Cloudflare Pages 的 **Settings** > **Environment variables** 中配置了所有必要的环境变量：

- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`

### 配置缓存规则

在 Cloudflare Dashboard 的 **Caching** 部分，可以配置：
- 缓存级别
- 浏览器缓存 TTL
- 边缘缓存 TTL

## 📝 常见问题

### Q: DNS 记录需要多长时间生效？

A: 通常几分钟到几小时，最长可能需要 24-48 小时。

### Q: SSL 证书需要多长时间颁发？

A: 通常几分钟到几小时。如果超过 24 小时仍未生效，检查 DNS 配置是否正确。

### Q: 如何配置多个域名？

A: 在 Cloudflare Pages 的 **Custom domains** 中，可以添加多个域名。每个域名都需要相应的 DNS 配置。

### Q: 如何配置子域名？

A: 在 DNS 设置中添加 CNAME 记录，Name 设置为子域名（例如：`studio`），Target 指向 Pages 地址。

### Q: 如何强制 HTTPS？

A: Cloudflare 默认会强制 HTTPS。在 **SSL/TLS** > **Edge Certificates** 中，确保 **Always Use HTTPS** 已启用。

## 🔗 相关链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare DNS 文档](https://developers.cloudflare.com/dns/)
- [Cloudflare SSL/TLS 文档](https://developers.cloudflare.com/ssl/)

## ✅ 检查清单

- [ ] 域名已添加到 Cloudflare Pages
- [ ] DNS 记录已正确配置
- [ ] SSL 证书已颁发
- [ ] 网站可以通过自定义域名访问
- [ ] HTTPS 正常工作
- [ ] 环境变量已配置
- [ ] 测试所有功能是否正常

---

**提示**：配置完成后，建议等待 24 小时让所有更改完全生效，然后进行全面测试。
