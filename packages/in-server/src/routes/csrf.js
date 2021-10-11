/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

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
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      res.status(401).send(undefined);
    } else {
      req.log.error({ err }, 'Failed to retrieve CSRF token');
      errorPages.send500(req, res);
    }
  }
});
