'use strict';
const fs = require('fs');
const path = require('path');
const { isAuthenticated } = require('./_auth');

// Dashboard disimpan di /private (tidak pernah disajikan sebagai file statis).
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (!isAuthenticated(req, process.env.SESSION_SECRET)) {
    res.statusCode = 302;
    res.setHeader('Location', '/login');
    return res.end();
  }
  const html = fs.readFileSync(path.join(process.cwd(), 'private', 'app.html'), 'utf8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.statusCode = 200;
  res.end(html);
};
