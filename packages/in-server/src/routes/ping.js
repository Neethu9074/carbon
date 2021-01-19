/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
const express = require('express');

const fetch = require('../services/fetch');

const router = (module.exports = express.Router());

router.get('/ping', async (req, res) => {
  try {
    await uiBackendHealthCheck(req.uiBackendBaseUrl);
    res.status(200).send('pong');
  } catch (e) {
    console.warn('Failed to communicate with ui-backend for ping/pong: %s', e.message);
    res.status(500).send('Sorry, internal ping/pong failed 🥺.');
  }
});

async function uiBackendHealthCheck(uiBackendBaseUrl) {
  try {
    const response = await fetch(`${uiBackendBaseUrl}/api/ping`);
    if (response.ok) {
      return true;
    }
    throw new Error(`ui-backend responded with status code ${response.statusCode}. Expected 200.`);
  } catch (e) {
    throw new Error(`Failed to contact ui-backend: ${String(e)}`);
  }
}
