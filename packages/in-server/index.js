'use strict';

require('instana-nodejs-sensor')({
  level: 'info',
  tracing: {
    enabled: true
  }
});

const express = require('express');
const cookieParser = require('cookie-parser');

const configEnrichment = require('./middleware/configEnrichment');
const unitCoordinates = require('./middleware/unitCoordinates');
const errorPagesRoutes = require('./routes/errorPages');
const serverConfig = require('./serverConfig.js');
const assetRoutes = require('./routes/assets');
const errorPages = require('./errorPages.js');
const indexRoutes = require('./routes/index');
const pingRoutes = require('./routes/ping');

require('./admin');

const app = express();

app.set('x-powered-by', false);

app.use(cookieParser());

app.use((req, res, next) => {
  // set security headers
  res.set('x-frame-options', 'deny');
  res.set('x-content-type-options', 'nosniff');
  res.set('x-xss-protection', '1; mode=block');
  next();
});

app.use(unitCoordinates);
app.use(errorPagesRoutes);
app.use(configEnrichment);
app.use(assetRoutes);
app.use(pingRoutes);
app.use(indexRoutes);

app.use((req, res) => errorPages.send404(req, res));

const server = app.listen(serverConfig.port, serverConfig.bindAddress, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('ui-client in-server listening at http://%s:%s', host, port);
});
