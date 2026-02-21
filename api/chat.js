export default async function handler(req, res) {
  const SECRET_KEY = process.env.OPENROUTER_API_KEY; // Auto-detects key
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SECRET_KEY}`
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.status(200).json(data);
}
