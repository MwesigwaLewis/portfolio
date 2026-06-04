// api/contact.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    // Option A: Send via Email (using a service like Resend - free tier)
    // Option B: Store in a database (Vercel KV, Upstash, etc.)
    // Option C: Log it and check Vercel logs (simplest for now)

    // For now, just log it (check Vercel dashboard > Logs)
    console.log('--- NEW MESSAGE ---');
    console.log(`From: ${name} <${email}>`);
    console.log(`Message: ${message}`);
    console.log('-------------------');

    // TODO: Replace with actual email sending below

    res.status(200).json({ success: true });
}
