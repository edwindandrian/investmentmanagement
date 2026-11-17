#!/usr/bin/env node
'use strict';
// Pemakaian: node scripts/hash-password.js "kata sandi Anda"
const crypto = require('crypto');
const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error('Beri kata sandi minimal 10 karakter: node scripts/hash-password.js "kata sandi Anda"');
  process.exit(1);
}
const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(pw, salt, 64);
console.log('AUTH_PASSWORD_HASH=scrypt$' + salt.toString('hex') + '$' + hash.toString('hex'));
console.log('SESSION_SECRET=' + crypto.randomBytes(32).toString('hex'));
