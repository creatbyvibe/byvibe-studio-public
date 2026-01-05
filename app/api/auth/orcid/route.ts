import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'no_code' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const orcidClientId = process.env.NEXT_PUBLIC_ORCID_CLIENT_ID;
    const orcidClientSecret = process.env.ORCID_CLIENT_SECRET; // 服务端密钥

    if (!supabaseUrl || !supabaseAnonKey || !orcidClientId || !orcidClientSecret) {
      return NextResponse.json({ error: 'config_missing' }, { status: 500 });
    }

    const requestUrl = new URL(request.url);
    const redirectUri = `${requestUrl.origin}/auth/orcid/callback`;

    // 交换 code 获取 access token
    const tokenResponse = await fetch('https://orcid.org/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        client_id: orcidClientId,
        client_secret: orcidClientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('ORCID token exchange failed:', errorData);
      return NextResponse.json({ error: 'token_exchange_failed' }, { status: 400 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 获取 ORCID 用户信息
    const userResponse = await fetch('https://pub.orcid.org/v3.0/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to fetch ORCID user info');
      return NextResponse.json({ error: 'user_info_failed' }, { status: 400 });
    }

    const userData = await userResponse.json();
    const orcidId = userData.path || userData['orcid-identifier']?.path;
    const name = userData.person?.name?.['given-names']?.value || 
                 userData.person?.name?.['family-name']?.value || 
                 'ORCID User';
    const email = userData.person?.emails?.['email']?.[0]?.['email'] || 
                  `${orcidId}@orcid.temp`;

    // 使用 Supabase Admin API 创建用户（需要服务端密钥）
    // 注意：这里需要使用 Supabase Admin Client，需要 SERVICE_ROLE_KEY
    // 当前实现：返回用户信息，让前端完成注册流程
    
    return NextResponse.json({
      success: false,
      requiresRegistration: true,
      orcidId,
      name,
      email,
    });
  } catch (error: any) {
    console.error('ORCID API error:', error);
    return NextResponse.json({ error: 'orcid_api_error' }, { status: 500 });
  }
}
