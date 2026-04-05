export default {
  async fetch(request, env) {
    // CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const formData = await request.formData();
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');

      const apiKey = env.RESEND_API_KEY || 're_PdSHDcrC_K9efULPY1fq1BsCrcMd33SpW';
      const toEmail = env.NOTIFICATION_EMAIL || 'jackpotrash@gmail.com';

      if (!name || !email || !subject || !message) {
        return new Response(JSON.stringify({ error: 'All fields are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      // 1. 運営への通知メール (Admin Notification)
      const adminRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'jAcKp☆TrASH Contact <onboarding@resend.dev>',
          to: [toEmail],
          reply_to: [email],
          subject: `[WEBお問合せ] ${subject}`,
          html: `
            <h3>WEBサイトからのお問い合わせ</h3>
            <p><strong>名前:</strong> ${name}</p>
            <p><strong>メール:</strong> ${email}</p>
            <p><strong>件名:</strong> ${subject}</p>
            <p><strong>内容:</strong></p>
            <div style="padding:15px; background:#f9f9f9; border-radius:5px; border:1px solid #eee;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          `
        }),
      });

      if (!adminRes.ok) {
        const errorData = await adminRes.json();
        console.error('Resend Admin Error:', errorData);
        throw new Error(`Resend Admin Mail Failed: ${JSON.stringify(errorData)}`);
      }

      // 2. ユーザーへの自動返信 (User Auto-Reply)
      // 注意: onboarding@resend.dev を使用している場合、宛先が認証済みのアドレスでないと失敗します。
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'jAcKp☆TrASH <onboarding@resend.dev>',
            to: [email],
            subject: 'お問い合わせありがとうございます【jAcKp☆TrASH】',
            html: `
              <p>${name} 様</p>
              <p>jAcKp☆TrASHへのお問い合わせ、誠にありがとうございます。</p>
              <p>以下の内容で受け付けいたしました。内容を確認の上、担当者より折り返しご連絡させていただきます。</p>
              <hr>
              <p><strong>お名前:</strong> ${name}</p>
              <p><strong>件名:</strong> ${subject}</p>
              <p><strong>内容:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            `
          }),
        });
      } catch (autoReplyError) {
        // 自動返信の失敗はメインプロセスの成功を妨げないようにする
        console.warn('Auto-reply failed (likely due to Resend restrictions):', autoReplyError);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Worker Error:', error);
      return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
