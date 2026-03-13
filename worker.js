export default {
  async fetch(request, env) {
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

      if (!name || !email || !subject || !message) {
        return new Response(JSON.stringify({ error: 'All fields are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 運営への通知メール送信
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer re_PdSHDcrC_K9efULPY1fq1BsCrcMd33SpW`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Contact Form <onboarding@resend.dev>', // 実際の独自ドメイン送信元に変える場合はここを変更
          to: ['jackpotrash@gmail.com'],
          reply_to: [email],
          subject: `[サイトお問合せ] ${subject}`,
          html: `
            <h2>jAcKp☆TrASH WEBサイト 問い合わせフォーム</h2>
            <p><strong>お名前:</strong> ${name}</p>
            <p><strong>メールアドレス:</strong> ${email}</p>
            <p><strong>件名:</strong> ${subject}</p>
            <p><strong>本文:</strong></p>
            <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
                ${message.replace(/\n/g, '<br>')}
            </div>
          `,
        }),
      });

      if (!resendResponse.ok) throw new Error('Failed to send notification email');

      // ユーザーへの自動返信
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer re_PdSHDcrC_K9efULPY1fq1BsCrcMd33SpW`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'jAcKp☆TrASH <onboarding@resend.dev>', // 同上
          to: [email],
          subject: '【jAcKp☆TrASH】お問い合わせありがとうございます',
          html: `
            <p>${name}様</p>
            <p>お問い合わせいただき、誠にありがとうございます。</p>
            <p>内容を確認次第、担当者よりご連絡させていただきます。<br>今しばらくお待ちくださいませ。</p>
            <hr>
            <p><strong>お送りいただいた内容:</strong></p>
            <p>件名: ${subject}</p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        }),
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
