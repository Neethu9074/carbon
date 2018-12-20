const express = require('express');

const uiBackendHealthCheck = require('../healthcheck/uiBackend');

const router = module.exports = express.Router();

router.get('/ping', (req, res) => {
  uiBackendHealthCheck()
    .then(() => res.status(200).send('pong'))
    .catch(err => {
      console.log('Failed to communicate with ui-backend for ping/pong: %s', err.message);
      res.status(500).send('Sorry, internal ping/pong failed 🥺.');
    });
});
