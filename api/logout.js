'use strict';
const { clearCookie } = require('./_auth');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Metode tidak diizinkan.' });
  }
  res.setHeader('Set-Cookie', clearCookie());
  return res.status(200).json({ ok: true });
};
