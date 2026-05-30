import fetch from 'node-fetch';

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export async function ttsHandler(req, res) {
  const { text, voiceName = 'en-US-Journey-F', speakingRate = 1.0, pitch = 1.0 } = req.body || {};

  if (!text || text.length > 500) {
    return sendJson(res, 400, { error: 'Invalid text' });
  }

  const apiKey = process.env.VITE_GOOGLE_TTS_API_KEY || process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey || apiKey === 'dummy_key_for_now') {
    // Return dummy audio for local dev without key
    return sendJson(res, 200, { audioContent: '' });
  }

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  const body = {
    input: { text },
    voice: {
      languageCode: 'en-US',
      name: voiceName,
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate,
      pitch,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (data.audioContent) {
      sendJson(res, 200, { audioContent: data.audioContent }); 
    } else {
      sendJson(res, 500, { error: 'TTS failed', detail: data });
    }
  } catch (err) {
    sendJson(res, 500, { error: 'Server error', detail: err.message });
  }
}
