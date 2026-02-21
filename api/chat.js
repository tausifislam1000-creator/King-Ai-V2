export default async function handler(req, res) {
  const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
  const SERPER_KEY = process.env.SERPER_API_KEY;

  if (req.method !== 'POST') return res.status(405).send('Use POST');

  let { messages, model } = req.body;
  const lastUserMessage = messages[messages.length - 1].content.toLowerCase();

  // 1. DETECTION: Does the user want to search?
  const searchTriggers = ['search', 'latest', 'news', 'who is', 'current', 'today'];
  const needsSearch = searchTriggers.some(word => lastUserMessage.includes(word));

  let context = "";

  if (needsSearch && SERPER_KEY) {
    try {
      // 2. THE SEARCH: Fetch live data from Google
      const searchRes = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "X-API-KEY": SERPER_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ q: lastUserMessage })
      });
      const searchData = await searchRes.json();
      
      // Summarize snippets for the AI
      context = searchData.organic.map(item => `Title: ${item.title}\nSource: ${item.snippet}`).join("\n\n");
      
      // 3. INJECTION: Feed the search results into the prompt
      messages.push({
        role: "system",
        content: `LIVE SEARCH RESULTS:\n${context}\n\nUse this data to answer the user's question accurately.`
      });
    } catch (err) {
      console.error("Search failed, proceeding without it.");
    }
  }

  // 4. THE AI CALL: Send everything to OpenRouter
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}
