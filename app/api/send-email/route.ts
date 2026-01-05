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

    // Validate input
    if (!to || !to.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    // 使用 Resend API 发送邮件
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      // If Resend is not configured, log and return success (development environment)
      console.log('Email would be sent to:', to);
      return NextResponse.json(
        { 
          success: true, 
          message: 'Email sending requires RESEND_API_KEY configuration',
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
        message: 'Email sent successfully',
        data: data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
