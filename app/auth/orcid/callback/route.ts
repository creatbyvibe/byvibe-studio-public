import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // ORCID OAuth 回调
    // 这里需要处理 ORCID 的 code 交换 token
    // 然后创建或更新 Supabase 用户
    // 暂时重定向到首页
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  }

  return NextResponse.redirect(new URL('/auth', requestUrl.origin));
}
