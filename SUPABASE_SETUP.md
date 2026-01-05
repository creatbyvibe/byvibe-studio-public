# Supabase 数据库设置指南

## 1. 创建 Waitlist 表

在 Supabase Dashboard 中执行以下 SQL 来创建 `waitlist` 表：

```sql
-- 创建 waitlist 表
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- 启用 Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许匿名用户插入数据（用于注册）
CREATE POLICY "Allow anonymous insert" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 创建策略：允许匿名用户查询自己的邮箱是否存在
CREATE POLICY "Allow anonymous select by email" ON waitlist
  FOR SELECT
  TO anon
  USING (true);
```

## 2. 验证表结构

执行以下查询验证表是否创建成功：

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'waitlist';
```

## 3. 测试插入

测试插入一条记录：

```sql
INSERT INTO waitlist (email, name)
VALUES ('test@example.com', 'Test User');
```

## 4. 环境变量配置

确保 `.env.local` 文件包含：

```
NEXT_PUBLIC_SUPABASE_URL=https://xejrdjqsuloecdeviopx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rMqAnJxp6DWT9SsowLTNcw_ucR4BqEk
```

## 5. API 端点

- **POST** `/api/waitlist` - 提交邮箱加入等待列表
  - Body: `{ "email": "user@example.com", "name": "User Name" }`
  - Response: `{ "success": true, "message": "成功加入等待列表！", "data": {...} }`

- **GET** `/api/waitlist?email=user@example.com` - 检查邮箱是否已注册
  - Response: `{ "exists": true/false }`

## 6. 错误处理

API 会返回以下错误状态码：
- `400` - 无效的邮箱地址
- `409` - 邮箱已存在
- `500` - 服务器错误
