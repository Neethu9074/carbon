const express = require('express');

const UnauthorizedError = require('../errors/UnauthorizedError.js');
const { getCsrfToken } = require('../services/csrf');
const errorPages = require('../errorPages');

const router = (module.exports = express.Router());

router.get('/csrf/token', async (req, res) => {
  res.vary('*');
  res.set('cache-control', 'private, no-cache, no-store, must-revalidate, max-age=0');

  try {
    const csrfToken = await getCsrfToken(req);
    res.set('x-csrf-token', csrfToken).send();
  } catch (e) {
    console.error('Failed to retrieve CSRF token', e);
    if (e instanceof UnauthorizedError) {
      res.status(401).send(undefined);
    } else {
      errorPages.send500(req, res);
    }
  }
});
