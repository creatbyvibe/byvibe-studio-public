import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // OAuth 回调成功，重定向到首页
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  }

  return NextResponse.redirect(new URL('/auth', requestUrl.origin));
}
