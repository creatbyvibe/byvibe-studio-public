import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getWelcomeEmailTemplate, getNotificationEmailTemplate } from '@/lib/email/templates'

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    // Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables are missing:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
      });
      return NextResponse.json(
        { 
          error: 'Service is not fully configured. Please contact support or check your environment variables.',
          details: 'Supabase environment variables are missing'
        },
        { status: 503 } // Service Unavailable
      );
    }

    // Create Supabase client
    let supabase;
    try {
      supabase = createServerClient();
    } catch (supabaseError: any) {
      console.error('Supabase client creation error:', supabaseError);
      return NextResponse.json(
        { 
          error: 'Service configuration error. Please contact support.',
          details: supabaseError.message
        },
        { status: 500 }
      );
    }

    // 插入到 waitlist 表
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email: email.toLowerCase().trim(),
          name: name?.trim() || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      // If duplicate email error
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already on the waitlist' },
          { status: 409 }
        )
      }

      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again later.' },
        { status: 500 }
      )
    }

    // 获取 origin（支持 Edge Runtime）
    const origin = request.headers.get('origin') || 
                  request.headers.get('host') ? `https://${request.headers.get('host')}` : 
                  'https://byvibe-studio-public.pages.dev';
    
    // 发送欢迎邮件（异步，不阻塞响应）
    try {
      const emailTemplate = getWelcomeEmailTemplate(name, email);
      
      const emailResponse = await fetch(`${origin}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email.toLowerCase().trim(),
          name: name?.trim(),
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Failed to send welcome email:', await emailResponse.text());
        // 邮件发送失败不影响主流程
      }
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // 邮件发送失败不影响主流程
    }

    // 发送通知邮件给管理员（异步，不阻塞响应）
    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL;
      
      if (adminEmail && adminEmail.includes('@')) {
        const notificationTemplate = getNotificationEmailTemplate(
          email.toLowerCase().trim(),
          name?.trim()
        );
        
        const notificationResponse = await fetch(`${origin}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: adminEmail,
            subject: notificationTemplate.subject,
            html: notificationTemplate.html,
          }),
        });

        if (!notificationResponse.ok) {
          console.error('Failed to send notification email:', await notificationResponse.text());
          // 通知邮件发送失败不影响主流程
        } else {
          console.log('Notification email sent to:', adminEmail);
        }
      } else {
        console.log('ADMIN_EMAIL not configured, skipping notification email');
      }
    } catch (notificationError) {
      console.error('Error sending notification email:', notificationError);
      // 通知邮件发送失败不影响主流程
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully joined waitlist! We\'ve sent a welcome email to your inbox.',
        data: data[0],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'Server error. Please try again later.' },
      { status: 500 }
    )
  }
}

// 可选：GET 方法用于检查邮箱是否已注册
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is normal
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Query failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      exists: !!data,
    })
  } catch (error) {
    console.error('Waitlist GET API error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
