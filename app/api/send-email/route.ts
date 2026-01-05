import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface EmailData {
  to: string;
  name?: string;
  subject: string;
  html: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailData = await request.json();
    const { to, name, subject, html } = body;

    // 验证输入
    if (!to || !to.includes('@')) {
      return NextResponse.json(
        { error: '有效的邮箱地址是必需的' },
        { status: 400 }
      );
    }

    // 使用 Resend API 发送邮件
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      // 如果没有配置 Resend，使用 Supabase Edge Function 或直接返回成功（开发环境）
      console.log('Email would be sent to:', to);
      return NextResponse.json(
        { 
          success: true, 
          message: '邮件发送功能需要配置 RESEND_API_KEY',
          sent: false 
        },
        { status: 200 }
      );
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'ByVibe <welcome@byvibe.ai>',
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const data = await response.json();

    return NextResponse.json(
      {
        success: true,
        message: '邮件发送成功',
        data: data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: error.message || '邮件发送失败，请稍后重试' },
      { status: 500 }
    );
  }
}
