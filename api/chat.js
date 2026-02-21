export default async function handler(req, res) {
  // AUTO-DETECTION: This line looks for the secret key in your server settings
  const SECRET_KEY = process.env.OPENROUTER_API_KEY;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SECRET_KEY}`, // Securely injected
        'HTTP-Referer': 'https://king-ai.vercel.app',
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server failed to connect to OpenRouter' });
  }
}
