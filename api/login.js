'use strict';
const { safeEqual, verifyPassword, createToken, sessionCookie } = require('./_auth');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function readBody(req) {
  const b = req.body;
  if (b && typeof b === 'object') return b;
  try { return JSON.parse(b || '{}'); } catch (e) { return {}; }
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Metode tidak diizinkan.' });
  }
  const { AUTH_USERNAME, AUTH_PASSWORD_HASH, SESSION_SECRET } = process.env;
  if (!AUTH_USERNAME || !AUTH_PASSWORD_HASH || !SESSION_SECRET) {
    return res.status(500).json({ error: 'Server belum dikonfigurasi. Atur AUTH_USERNAME, AUTH_PASSWORD_HASH, dan SESSION_SECRET di Vercel.' });
  }
  const { username = '', password = '' } = readBody(req);
  if (typeof username !== 'string' || typeof password !== 'string' || username.length > 200 || password.length > 500) {
    return res.status(400).json({ error: 'Data tidak valid.' });
  }
  // Selalu jalankan kedua pemeriksaan agar waktu respons tidak membocorkan nama pengguna.
  const userOk = safeEqual(username, AUTH_USERNAME);
  const passOk = await verifyPassword(password, AUTH_PASSWORD_HASH);
  if (!(userOk && passOk)) {
    await sleep(700);
    return res.status(401).json({ error: 'Nama pengguna atau kata sandi salah.' });
  }
  res.setHeader('Set-Cookie', sessionCookie(createToken(SESSION_SECRET)));
  return res.status(200).json({ ok: true });
};
