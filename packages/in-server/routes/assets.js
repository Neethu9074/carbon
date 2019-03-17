const express = require('express');

const paths = require('../services/paths');

const router = module.exports = express.Router();
const cacheControlHeader = 'public, max-age=86400, stale-while-revalidate=3600, stale-if-error=86400';
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


// support both requests with and without checksum
router.get('/bundle/index.js', sendIndexJs);
router.get('/bundle/index-*.js', sendIndexJs);
function sendIndexJs(req, res) {
  res.sendFile(
    paths.indexJs,
    sendFilesConfig,
    err => {
      if (err) {
        console.error('Failed to send file. Cannot complete request.', err);
      }
    }
  );
}

// support both requests with and without checksum
router.get('/bundle/index.css', sendIndexCss);
router.get('/bundle/index-*.css', sendIndexCss);
function sendIndexCss(req, res) {
  res.sendFile(
    paths.indexCss,
    sendFilesConfig,
    err => {
      if (err) {
        console.error('Failed to send file. Cannot complete request.', err);
      }
    }
  );
}
