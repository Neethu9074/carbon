const express = require('express');

const checkSumMod = require('../services/checksum');
const paths = require('../services/paths');

const indexJsChecksum = checkSumMod.getChecksumForFile(paths.indexJs);
const indexCssChecksum = checkSumMod.getChecksumForFile(paths.indexCss);

const router = module.exports = express.Router();
const cacheControlHeader = 'public, max-age=86400';
const sendFilesConfig = {
  headers: {
    'Cache-Control': cacheControlHeader
  }
};


// do not permit access to our internal chunk
router.use('/bundle/internal.*.js', (req, res, next) => {
  if (req.tenant === 'instana' || req.tenant === 'instanaops') {
    next();
  } else {
    res.sendStatus(403);
  }
});


// assets directory will be populated with generated JavaScript during the build process.
router.use(express.static(paths.assetDir, {
  cacheControl: false,
  setHeaders(res) {
    res.setHeader('Cache-Control', cacheControlHeader);
  }
}));

// This file doesn't actually exist on disk. The path exists for cache busting reasons.
// When receiving the call, we need to make sure that the version supplied is actually
// the version this ui-client supports. If it is not, we must return a 404 so that the
// proxy may attempt calling another ui-client to retrieve the correct file.
router.get('/bundle/index-:version.js', (req, res) => {
  if (req.params.version !== indexJsChecksum) {
    res.sendStatus(404);
    return;
  }

  res.sendFile(
    paths.indexJs,
    sendFilesConfig,
    err => {
      if (err) {
        console.error('Failed to send file. Cannot complete request.', err);
      }
    }
  );
});

// This file doesn't actually exist on disk. The path exists for cache busting reasons.
// When receiving the call, we need to make sure that the version supplied is actually
// the version this ui-client supports. If it is not, we must return a 404 so that the
// proxy may attempt calling another ui-client to retrieve the correct file.
router.get('/bundle/index-:version.css', (req, res) => {
  if (req.params.version !== indexCssChecksum) {
    res.sendStatus(404);
    return;
  }

  res.sendFile(
    paths.indexCss,
    sendFilesConfig,
    err => {
      if (err) {
        console.error('Failed to send file. Cannot complete request.', err);
      }
    }
  );
});
