/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
const express = require('express');

const configEnrichment = require('../middleware/configEnrichment');
const { activeResolver } = require('../services/resolvers/index');
const unitCoordinates = require('../middleware/unitCoordinates');
const checkSumMod = require('../services/checksum');
const { getCurrentUser } = require('../auth');
const paths = require('../services/paths');

const indexJsChecksum = checkSumMod.getChecksumForFile(paths.indexJs);
const waitingJsChecksum = checkSumMod.getChecksumForFile(paths.waitingJs);

const router = (module.exports = express.Router());
const cacheControlHeader = 'public, max-age=86400, stale-while-revalidate=3600, stale-if-error=86400';
const sendFilesConfig = {
  headers: {
    'Cache-Control': cacheControlHeader
  }
};

// Do not permit access to our internal chunk.
router.use('/bundle/internal.*.js', unitCoordinates);
router.use('/bundle/internal.*.js', configEnrichment);
router.use('/bundle/internal.*.js', async (req, res, next) => {
  try {
    const featureFlags = await activeResolver.getFeatureFlags(req.tenant, req.unit);
    if (featureFlags.internalMonitoringUnit) {
      next();
      return;
    }

    const [statusCode, userStr] = await getCurrentUser(req);
    if (statusCode !== 200) {
      res.sendStatus(statusCode);
      return;
    }

    res.setHeader('Vary', 'Cookie');
    const user = getUserFromUserStr(userStr);
    if (user && user.email.endsWith('@instana.com')) {
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (e) {
    console.error('Failed to deliver bundle to user:', e);
    res.send500(req, res);
  }
});

// assets directory will be populated with generated JavaScript during the build process.
router.use(
  express.static(paths.assetDir, {
    cacheControl: false,
    setHeaders(res) {
      res.setHeader('Cache-Control', cacheControlHeader);
    }
  })
);

// This file doesn't actually exist on disk. The path exists for cache busting reasons.
// When receiving the call, we need to make sure that the version supplied is actually
// the version this ui-client supports. If it is not, we must return a 404 so that the
// proxy may attempt calling another ui-client to retrieve the correct file.

router.get('/bundle/index-:version.js', (req, res) => {
  checkChecksumAndSend(req, res, indexJsChecksum, paths.indexJs);
});

router.get('/bundle/waiting-:version.js', (req, res) => {
  checkChecksumAndSend(req, res, waitingJsChecksum, paths.waitingJs);
});

function checkChecksumAndSend(req, res, checksumToCheck, fileToSend) {
  if (req.params.version !== checksumToCheck) {
    res.sendStatus(404);
    return;
  }

  res.sendFile(fileToSend, sendFilesConfig, err => {
    if (err) {
      console.error('Failed to send file. Cannot complete request.', err);
    }
  });
}

function getUserFromUserStr(userStr) {
  let user;
  try {
    user = JSON.parse(userStr);
  } catch (error) {
    user = null;
  }
  return user;
}
