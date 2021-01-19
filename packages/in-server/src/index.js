/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
'use strict';

require('@instana/collector')({
  level: 'info'
});

const express = require('express');
const cookieParser = require('cookie-parser');

const configEnrichment = require('./middleware/configEnrichment');
const unitCoordinates = require('./middleware/unitCoordinates');
const maximumCookies = require('./routes/maximumCookies');
const errorPagesRoutes = require('./routes/errorPages');
const serverConfig = require('./serverConfig.js');
const productRoutes = require('./routes/product');
const waitingRoutes = require('./routes/waiting');
const assetRoutes = require('./routes/assets');
const errorPages = require('./errorPages.js');
const csrfRoutes = require('./routes/csrf');
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
  res.set('referrer-policy', 'same-origin');
  res.set('x-permitted-cross-domain-policies', 'none');
  next();
});

app.use(errorPagesRoutes);
app.use(assetRoutes);
app.use(maximumCookies);

// Allow retrieval of assets without valid unit identification.
app.use(unitCoordinates);

app.use(csrfRoutes);

// we need to place the waiting resource middleware before we enrich the config because
// we don't have a deployed backend for now. Therefore the config cannot work correctly
app.use(waitingRoutes);

// Do not execute configEnrichment before the asset routes. This would otherwise break
// CSS retrieval for cases in which the ui-backend cannot be located in consul.
app.use(configEnrichment);
app.use(pingRoutes);
app.use(productRoutes);

app.use((req, res) => errorPages.send404(req, res));

const server = app.listen(serverConfig.port, serverConfig.bindAddress, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('ui-client in-server listening at http://%s:%s', host, port);
});
