'use strict';
const crypto = require('crypto');
const { promisify } = require('util');
const scrypt = promisify(crypto.scrypt);

const COOKIE = 'pp_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

const b64 = (buf) => Buffer.from(buf).toString('base64url');
const hmac = (secret, data) => crypto.createHmac('sha256', secret).update(data).digest();
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest();

// Perbandingan waktu-konstan untuk string berukuran berbeda.
function safeEqual(a, b) {
  return crypto.timingSafeEqual(sha(a), sha(b));
}

// Format hash: scrypt$<salt hex>$<hash hex>
async function verifyPassword(password, stored) {
  const parts = String(stored || '').split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const salt = Buffer.from(parts[1], 'hex');
  const expected = Buffer.from(parts[2], 'hex');
  if (!salt.length || !expected.length) return false;
  const actual = await scrypt(String(password), salt, expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

function createToken(secret) {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return exp + '.' + b64(hmac(secret, exp));
}

function readCookie(header, name) {
  for (const part of String(header || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return '';
}

function isAuthenticated(req, secret) {
  if (!secret) return false;
  const token = readCookie(req.headers.cookie, COOKIE);
  const [exp, sig] = token.split('.');
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false;
  const good = b64(hmac(secret, exp));
  return good.length === sig.length && crypto.timingSafeEqual(Buffer.from(good), Buffer.from(sig));
}

const baseAttrs = 'Path=/; HttpOnly; Secure; SameSite=Lax';
const sessionCookie = (token) => `${COOKIE}=${token}; ${baseAttrs}; Max-Age=${MAX_AGE}`;
const clearCookie = () => `${COOKIE}=; ${baseAttrs}; Max-Age=0`;

module.exports = { safeEqual, verifyPassword, createToken, isAuthenticated, sessionCookie, clearCookie };
