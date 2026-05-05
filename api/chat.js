export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'La clé OPENROUTER_API_KEY est manquante dans les variables d\'environnement Vercel.' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://baticostt.vercel.app',
        'X-Title': 'BatiCOST Premium'
      },
      body: JSON.stringify({
        model: req.body.model || 'meta-llama/llama-3.2-3b-instruct:free',
        messages: req.body.messages,
        temperature: req.body.temperature || 0.2,
        max_tokens: req.body.max_tokens || 600
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
