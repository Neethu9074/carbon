'use strict';

require('instana-nodejs-sensor')();

const express = require('express');
const cookieParser = require('cookie-parser');
const errorPages = require('./errorPages.js');

const routes = require('./routes');

const app = express();

app.set('x-powered-by', false);

app.use(cookieParser());
app.use(routes);

app.use((req, res) => {
  errorPages.send404(req, res);
});

const server = app.listen(3131, '127.0.0.1', () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('ui-client in-server listening at http://%s:%s', host, port);
});
