/**
 * 开发模式工具
 * 用于本地开发时绕过认证，直接预览功能
 */

// 开发模式开关（设置为 true 可以绕过认证）
export const DEV_MODE = process.env.NODE_ENV === 'development';

// 开发模式下的模拟用户
export const DEV_MOCK_USER = {
  id: 'dev-user-123',
  email: 'dev@byvibe.ai',
  name: 'Dev User',
};

// 检查是否应该使用开发模式
export function shouldUseDevMode(): boolean {
  return DEV_MODE && !process.env.NEXT_PUBLIC_SUPABASE_URL;
}

// 获取开发模式用户
export function getDevUser() {
  return DEV_MOCK_USER;
}
