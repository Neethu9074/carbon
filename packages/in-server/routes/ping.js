const request = require('request');
const express = require('express');

const router = module.exports = express.Router();

router.get('/ping', (req, res) => {
  uiBackendHealthCheck(req.uiBackendBaseUrl)
    .then(() => res.status(200).send('pong'))
    .catch(err => {
      console.log('Failed to communicate with ui-backend for ping/pong: %s', err.message);
      res.status(500).send('Sorry, internal ping/pong failed 🥺.');
    });
});

function uiBackendHealthCheck(uiBackendBaseUrl) {
  return new Promise((resolve, reject) => {
    request({
      url: uiBackendBaseUrl + '/ping',
      timeout: 5000
    }, (error, response) => {
      if (error) {
        reject(new Error(`Failed to contact ui-backend: ${String(error)}`));
      } else if (response.statusCode === 200) {
        resolve('OK.');
      } else {
        reject(new Error(`UI-Backend responded with status code ${response.statusCode}. Expected 200.`));
      }
    });
  });
};
