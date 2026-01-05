import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  // 处理错误情况
  if (error) {
    console.error('ORCID OAuth error:', error);
    return NextResponse.redirect(new URL('/auth?error=orcid_auth_failed', requestUrl.origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/auth?error=no_code', requestUrl.origin));
  }

  try {
    // 调用内部 API 处理 ORCID token 交换
    const apiUrl = new URL('/api/auth/orcid', requestUrl.origin);
    
    const apiResponse = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return NextResponse.redirect(
        new URL(`/auth?error=${errorData.error || 'orcid_auth_failed'}`, requestUrl.origin)
      );
    }

    const result = await apiResponse.json();
    
    // 如果成功创建/登录用户，重定向到首页
    if (result.success) {
      return NextResponse.redirect(new URL('/', requestUrl.origin));
    }

    // 如果需要用户完成注册，传递 ORCID 信息
    if (result.requiresRegistration) {
      return NextResponse.redirect(
        new URL(
          `/auth?orcid_id=${result.orcidId}&orcid_name=${encodeURIComponent(result.name)}&orcid_email=${encodeURIComponent(result.email)}`,
          requestUrl.origin
        )
      );
    }

    return NextResponse.redirect(new URL('/auth?error=unknown', requestUrl.origin));
  } catch (error: any) {
    console.error('ORCID callback error:', error);
    return NextResponse.redirect(new URL('/auth?error=orcid_callback_error', requestUrl.origin));
  }
}
