import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getWelcomeEmailTemplate } from '@/lib/email/templates'

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    // 验证输入
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '有效的邮箱地址是必需的' },
        { status: 400 }
      )
    }

    // 创建 Supabase 客户端
    const supabase = createServerClient()

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
      // 如果是重复邮箱错误
      if (error.code === '23505') {
        return NextResponse.json(
          { error: '该邮箱已加入等待列表' },
          { status: 409 }
        )
      }

      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: '提交失败，请稍后重试' },
        { status: 500 }
      )
    }

    // 发送欢迎邮件（异步，不阻塞响应）
    try {
      const emailTemplate = getWelcomeEmailTemplate(name, email);
      
      // 获取 origin（支持 Edge Runtime）
      const origin = request.headers.get('origin') || 
                    request.headers.get('host') ? `https://${request.headers.get('host')}` : 
                    'https://byvibe-studio-public.pages.dev';
      
      // 调用邮件发送 API
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

    return NextResponse.json(
      {
        success: true,
        message: '成功加入等待列表！我们已发送欢迎邮件到你的邮箱。',
        data: data[0],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
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
        { error: '邮箱参数是必需的' },
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
      // PGRST116 是"未找到"错误，这是正常的
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: '查询失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      exists: !!data,
    })
  } catch (error) {
    console.error('Waitlist GET API error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
