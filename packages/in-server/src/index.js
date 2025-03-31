/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

'use strict';

require('@instana/collector')({
  level: 'info'
});

const { createHttpTerminator } = require('http-terminator');

const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const express = require('express');

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
const solisRoutes = require('./routes/solis');

const { logger } = require('./logging');

const adminServer = require('./admin');
const adminServerHttpTerminator = createHttpTerminator({ server: adminServer });

const { activeResolver } = require('./services/resolvers');

const app = express();

app.set('x-powered-by', false);

app.use((req, res, next) => {
  // Assign a request ID so that we can correlate logs across multiple log entries
  req.id = req.get('x-request-id') || uuidv4();
  next();
});

app.use(
  require('pino-http')({
    logger,
    customLogLevel(req, err) {
      if (err || req.statusCode >= 500) {
        return 'warn';
      } else if (req.statusCode >= 400) {
        return 'debug';
      }
      return 'trace';
    },
    customProps(req) {
      return {
        traceId: req.get('x-instana-t')
      };
    }
  })
);

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
app.use(solisRoutes);

app.use((req, res) => errorPages.send404(req, res));

const server = app.listen(serverConfig.port, serverConfig.bindAddress, () => {
  const host = server.address().address;
  const port = server.address().port;

  logger.info('ui-client in-server listening at http://%s:%s', host, port);
});
const serverHttpTerminator = createHttpTerminator({ server: server });

function shutdownAdminServerAndHttpServer() {
  adminServerHttpTerminator.terminate().then(() => {
    logger.info('Admin server closed');
  });
  serverHttpTerminator.terminate().then(() => {
    logger.info('HTTP server closed');
  });
}

function shutdownResolverIfNeeded() {
  activeResolver.shutdown?.().then(() => {
    logger.info('Resolver based server closed');
  });
}

/** react on a k8s shutdown signal */
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Shutting down.');
  shutdownAdminServerAndHttpServer();
  shutdownResolverIfNeeded();
});

/** react on a Ctrl-C in a shell */
process.on('SIGINT', () => {
  logger.info('SIGINT signal received. Shutting down.');
  shutdownAdminServerAndHttpServer();
  shutdownResolverIfNeeded();
});
