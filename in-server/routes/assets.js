const express = require('express');
const path = require('path');

const paths = require('../services/paths');

const router = module.exports = express.Router();
const immutableCacheControlHeader = 'max-age=365000000, immutable';
const sendImmutableFilesConfig = {
  headers: {
    'Cache-Control': immutableCacheControlHeader
  }
};


// assets directory will be populated with generated JavaScript during the build process.
router.use(express.static(paths.assetDir, {
  cacheControl: false,
  setHeaders(res) {
    res.setHeader('Cache-Control', immutableCacheControlHeader);
  }
}));


// support both requests with and without checksum
router.get('/bundle/index.js', sendIndexJs);
router.get('/bundle/index-*.js', sendIndexJs);


function sendIndexJs(req, res) {
  res.sendFile(
    paths.indexJs,
    sendImmutableFilesConfig,
    err => {
      if (err) {
        console.error('Failed to send file. Cannot complete request.', err);
      }
    }
  );
}


router.get('/bundle/theme-*.css', (req, res) => {
  const url = req.originalUrl;
  const match = url.match(/theme-(\w+)(-.*)?\.css$/);
  if (!match) {
    res.sendStatus(404);
    return;
  }

  const themeName = match[1];
  res.sendFile(
    path.join(paths.bundleDir, 'theme-' + themeName + '.css'),
    sendImmutableFilesConfig,
    err => {
      if (err) {
        res.sendStatus(404);
      }
    }
  );
});
