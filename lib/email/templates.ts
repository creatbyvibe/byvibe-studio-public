export function getNotificationEmailTemplate(userEmail: string, userName?: string) {
  const displayName = userName || userEmail.split('@')[0];
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  
  return {
    subject: `New Waitlist Signup: ${userEmail}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Waitlist Signup</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #050505; color: #ffffff;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #050505;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #1a1a1a; border: 1px solid #333;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #333;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff;">
                byvibe<span style="color: #666;">.ai</span>
              </h1>
              <p style="margin: 10px 0 0; font-size: 14px; color: #666;">Waitlist Notification</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: bold; color: #3b82f6;">
                🎉 New Waitlist Signup
              </h2>
              
              <div style="background-color: #0a0a0a; border-left: 3px solid #3b82f6; padding: 20px; margin: 20px 0;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #cccccc;">
                      <strong style="color: #ffffff;">Email:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #ffffff; text-align: right;">
                      ${userEmail}
                    </td>
                  </tr>
                  ${userName ? `
                  <tr>
                    <td style="padding: 8px 0; color: #cccccc;">
                      <strong style="color: #ffffff;">Name:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #ffffff; text-align: right;">
                      ${displayName}
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #cccccc;">
                      <strong style="color: #ffffff;">Time:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #ffffff; text-align: right;">
                      ${timestamp} UTC
                    </td>
                  </tr>
                </table>
              </div>
              
              <p style="margin: 30px 0 20px; font-size: 16px; line-height: 1.6; color: #cccccc;">
                A new user has joined the ByVibe waitlist. You can view all waitlist entries in your Supabase dashboard.
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://byvibe-studio-public.pages.dev" 
                   style="display: inline-block; padding: 14px 32px; background: linear-gradient(110deg, #3b82f6 40%, #60a5fa 50%, #3b82f6 60%); background-size: 200% 100%; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 6px;">
                  View Dashboard
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #333; background-color: #0a0a0a;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                © 2026 ByVibe. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };
}

export function getWelcomeEmailTemplate(name?: string, email?: string) {
  const userName = name || email?.split('@')[0] || 'there';
  
  return {
    subject: 'Welcome to ByVibe Waitlist! 🎉',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ByVibe</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #050505; color: #ffffff;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #050505;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #1a1a1a; border: 1px solid #333;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #333;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff;">
                byvibe<span style="color: #666;">.ai</span>
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: bold; color: #ffffff;">
                Welcome to ByVibe, ${userName}! 🎉
              </h2>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #cccccc;">
                Thank you for joining the ByVibe waitlist! We're excited that you're interested in what we're building.
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #cccccc;">
                <strong>ByVibe</strong> is an AI engineering orchestration layer that helps you transform natural language ideas into deployable products. We inject engineering rigor into AI workflows, ensuring your Vibe Coding compiles into scalable products.
              </p>
              
              <div style="background-color: #0a0a0a; border-left: 3px solid #3b82f6; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px; font-size: 18px; color: #3b82f6;">
                  🚀 What's Next?
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #cccccc; line-height: 1.8;">
                  <li>We'll keep you updated on product progress</li>
                  <li>You'll get first access when we launch</li>
                  <li>Receive exclusive feature previews and tutorials</li>
                </ul>
              </div>
              
              <p style="margin: 30px 0 20px; font-size: 16px; line-height: 1.6; color: #cccccc;">
                In the meantime, you can:
              </p>
              
              <table role="presentation" style="width: 100%; margin: 20px 0;">
                <tr>
                  <td style="padding: 15px; background-color: #0a0a0a; border: 1px solid #333; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px; color: #cccccc;">
                      💡 <strong>Try Our AI Engine</strong><br>
                      <span style="color: #666;">Visit our website and try a free AI project planning generation</span>
                    </p>
                  </td>
                </tr>
              </table>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://byvibe-studio-public.pages.dev" 
                   style="display: inline-block; padding: 14px 32px; background: linear-gradient(110deg, #3b82f6 40%, #60a5fa 50%, #3b82f6 60%); background-size: 200% 100%; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 6px; transition: all 0.3s;">
                  Visit ByVibe
                </a>
              </div>
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #666; border-top: 1px solid #333; padding-top: 30px;">
                If you have any questions or suggestions, feel free to reply to this email. We'd love to hear from you!
              </p>
              
              <p style="margin: 20px 0 0; font-size: 14px; color: #666;">
                Best regards,<br>
                <strong style="color: #ffffff;">The ByVibe Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #333; background-color: #0a0a0a;">
              <p style="margin: 0 0 10px; font-size: 12px; color: #666;">
                © 2026 ByVibe. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #666;">
                <a href="https://byvibe-studio-public.pages.dev" style="color: #3b82f6; text-decoration: none;">Website</a> | 
                <a href="mailto:make@byvibe.ai" style="color: #3b82f6; text-decoration: none;">Contact Us</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };
}
