'use strict';

require('instana-nodejs-sensor')({
  level: 'info',
  tracing: {
    enabled: true
  }
});

const express = require('express');
const cookieParser = require('cookie-parser');
const errorPages = require('./errorPages.js');
const serverConfig = require('./serverConfig.js');

const assetRoutes = require('./routes/assets');
const indexRoutes = require('./routes/index');

const app = express();

app.set('x-powered-by', false);

app.use(cookieParser());

app.use(assetRoutes);
app.use(indexRoutes);

app.use((req, res) => errorPages.send404(req, res));

const server = app.listen(serverConfig.port, serverConfig.bindAddress, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('ui-client in-server listening at http://%s:%s', host, port);
});
