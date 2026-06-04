import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Portfolio <onboarding@resend.dev>',
            to: 'mwesigwalewis15@gmail.com',
            subject: `Portfolio Contact from ${name}`,
            replyTo: email,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
                        .header h1 { margin: 0; font-size: 24px; }
                        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
                        .field { margin-bottom: 20px; }
                        .field-label { font-weight: 600; color: #6366f1; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
                        .field-value { font-size: 16px; color: #1e293b; }
                        .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #6366f1; margin-top: 10px; }
                        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #94a3b8; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>New Portfolio Message</h1>
                    </div>
                    <div class="content">
                        <div class="field">
                            <div class="field-label">From</div>
                            <div class="field-value">${name}</div>
                        </div>
                        <div class="field">
                            <div class="field-label">Email</div>
                            <div class="field-value">${email}</div>
                        </div>
                        <div class="field">
                            <div class="field-label">Message</div>
                            <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                        </div>
                    </div>
                    <div class="footer">
                        Sent from your portfolio website
                    </div>
                </body>
                </html>
            `,
            text: `New message from your portfolio:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        });

        if (error) {
            console.error('Resend error:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }

        return res.status(200).json({ success: true, id: data?.id });

    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
