/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const express = require('express');
const serverConfig = require('./serverConfig.js');

const app = express();

app.get('/healthcheck', (req, res) => res.json({}));
app.get('/config', (req, res) =>
  res.json({
    config: serverConfig
  })
);

const server = app.listen(serverConfig.adminPort, '0.0.0.0', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('ui-client admin server listening at http://%s:%s', host, port);
});
