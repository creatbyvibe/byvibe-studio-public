import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getWelcomeEmailTemplate, getNotificationEmailTemplate } from '@/lib/email/templates'

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'waitlist-20260106',hypothesisId:'A',location:'app/api/waitlist/route.ts:POST:entry',message:'waitlist POST entry',data:{hasSupabaseUrl:!!process.env.NEXT_PUBLIC_SUPABASE_URL,hasSupabaseAnonKey:!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,hasResendApiKey:!!process.env.RESEND_API_KEY,hasAdminEmail:!!(process.env.ADMIN_EMAIL||process.env.NOTIFICATION_EMAIL),hasOrigin:!!request.headers.get('origin'),hasHost:!!request.headers.get('host')},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log

    const body = await request.json()
    const { email, name } = body

    // Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      )
    }

    const emailNormalized = String(email).toLowerCase().trim()
    const nameNormalized = typeof name === 'string' ? name.trim() : ''

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'waitlist-20260106',hypothesisId:'A',location:'app/api/waitlist/route.ts:POST:parsed',message:'waitlist request parsed',data:{hasName:!!nameNormalized,emailLen:emailNormalized.length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log

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
    const rowBase: Record<string, unknown> = {
      email: emailNormalized,
      created_at: new Date().toISOString(),
    }
    const rowWithOptionalName =
      nameNormalized.length > 0 ? { ...rowBase, name: nameNormalized } : rowBase

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'waitlist-20260106',hypothesisId:'A',location:'app/api/waitlist/route.ts:POST:insert:attempt1',message:'waitlist insert attempt1',data:{payloadKeys:Object.keys(rowWithOptionalName)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log

    let { data, error } = await supabase.from('waitlist').insert([rowWithOptionalName]).select()

    // 兼容旧版/自建 waitlist 表：可能没有 name/created_at 字段
    if (error) {
      const msg = (error as any)?.message || ''
      const code = (error as any)?.code || ''
      const looksLikeMissingColumn =
        code === '42703' || msg.includes('column') || msg.includes('does not exist') || msg.includes('PGRST')

      if (looksLikeMissingColumn) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'waitlist-20260106',hypothesisId:'C',location:'app/api/waitlist/route.ts:POST:insert:retry',message:'waitlist insert retry due to possible schema mismatch',data:{errorCode:code,hasMessage:!!msg},timestamp:Date.now()})}).catch(()=>{});
        // #endregion agent log

        // retry 1: drop name
        ;({ data, error } = await supabase.from('waitlist').insert([{ ...rowBase }]).select())

        // retry 2: drop created_at as well (if table has default)
        if (error) {
          ;({ data, error } = await supabase.from('waitlist').insert([{ email: emailNormalized }]).select())
        }
      }
    }

    if (error) {
      // If duplicate email error
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already on the waitlist' },
          { status: 409 }
        )
      }

      // RLS policy / permission issues are common for public waitlist
      const msg = (error as any)?.message || ''
      if (
        msg.includes('row-level security') ||
        msg.includes('permission denied') ||
        msg.includes('not allowed') ||
        msg.includes('insufficient_privilege')
      ) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/938b3518-4852-4c89-8195-34f66fcdebec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'waitlist-20260106',hypothesisId:'B',location:'app/api/waitlist/route.ts:POST:insert:rls',message:'waitlist insert blocked by RLS/permissions',data:{errorCode:(error as any)?.code||'',hasMessage:!!msg},timestamp:Date.now()})}).catch(()=>{});
        // #endregion agent log
        return NextResponse.json(
          {
            error: 'Waitlist insert is blocked by database security policy (RLS). Please add an INSERT policy for the waitlist table.',
          },
          { status: 403 }
        )
      }

      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again later.' },
        { status: 500 }
      )
    }

    // 获取 origin（支持 Edge Runtime）
    const origin =
      request.headers.get('origin') ??
      (request.headers.get('host') ? `https://${request.headers.get('host')}` : 'https://byvibe-studio-public.pages.dev')
    
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
        data: Array.isArray(data) ? data[0] : data,
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
