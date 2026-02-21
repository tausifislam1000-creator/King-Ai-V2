// This file hides your API key from all users
export default async function handler(req, res) {
  // It automatically detects the key from your Vercel/Server environment
  const KEY = process.env.OPENROUTER_API_KEY;

  if (req.method !== 'POST') return res.status(405).send('Use POST');

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KEY}`,
        'HTTP-Referer': 'https://your-site.com', 
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server Connection Error' });
  }
}
