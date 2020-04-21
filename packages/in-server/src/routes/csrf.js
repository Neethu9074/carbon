const express = require('express');

const { getCsrfToken } = require('../services/csrf');

const router = (module.exports = express.Router());

router.get('/csrf/token', (req, res) => {
  res.vary('*');
  res.set('cache-control', 'private, no-cache, no-store, must-revalidate, max-age=0');

  getCsrfToken(req)
    .then(csrfToken => {
      res.set('x-csrf-token', csrfToken).send();
    })
    .catch(err => {
      console.error(err);
      res.send(undefined);
    });
});
