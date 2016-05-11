'use strict';

const express = require('express');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const uuid = require('node-uuid');
const sendRequest = require('request');

const serverConfig = require('./serverConfig.js');
const clientConfig = require('./assets/config.json');
const checkSumMod = require('./checksum');
const getChecksumForFile = checkSumMod.getChecksumForFile;
const getSriIntegrityForFile = checkSumMod.getSriIntegrityForFile;

const router = module.exports = express.Router();

const staticFileMaxCachingDurationMs = 1000 * 60 * 60 * 24 * 7;

const rawTemplate = fs.readFileSync(
  path.join(__dirname, 'templates', 'index.hbs'),
  {encoding: 'utf8'}
);
const compiledTemplate = Handlebars.compile(rawTemplate);

const assetDir = path.join(__dirname, 'assets');
const bundleDir = path.join(assetDir, 'bundle');

const fullIndexJsPath = path.join(bundleDir, 'index.js');
const indexJsSri = getSriIntegrityForFile(fullIndexJsPath);
const indexJsChecksum = getChecksumForFile(fullIndexJsPath);
const themes = fs.readdirSync(bundleDir)
  .reduce((themeHashes, fileName) => {
    const match = fileName.match(/^theme-(\w+)\.css$/);
    if (match) {
      const themeName = match[1];
      const themeConfig = fs.readFileSync(
        path.join(__dirname, 'assets', themeName, 'config.json'),
        {encoding: 'utf8'}
      );
      const fullFilePath = path.join(bundleDir, fileName);
      themeHashes[themeName] = {
        fileName,
        checksum: getChecksumForFile(fullFilePath),
        sri: getSriIntegrityForFile(fullFilePath),
        // parse & stringify to remove all extra whitespace. Basically "minify"
        // the JSON.
        config: JSON.stringify(JSON.parse(themeConfig))
      };
    }
    return themeHashes;
  }, {});

// assets directory will be populated with generated JavaScript during the build process.
router.use(express.static(assetDir, {
  maxAge: staticFileMaxCachingDurationMs
}));


router.get('/', (req, res) => {
  askUiBackendWhetherTheRequestIsAuthorized(req, (err, status) => {
    if (err) {
      console.error('Failed to communicate with the UI-backend:', err);
      res.status(500).send('Sorry, our internal communication failed :(.');
      return;
    }

    if (status === 401) {
      // TODO Ben once groundskeeper is publicly deployed this needs to be a redirect to
      // the publicly available groundskeeper.
      const requestedAbsoluteUrl = serverConfig.baseUrl + req.originalUrl;
      res.redirect(
        serverConfig.baseUrl + '/auth/signIn?returnUrl=' + encodeURIComponent(requestedAbsoluteUrl)
      );
      return;
    } else if (status === 403) {
      res.status(403).send('Access denied!');
      return;
    } else if (status < 200 || status > 299) {
      console.error('Undefined state: Server returned unknown status code ' + status);
      res.status(500).send('Sorry, we received something that we do not understand. This is a ' +
        'failure on our side and we are sorry for that :(.');
      return;
    }

    // extract enabled theme from cookie. Might move to a backend component at some
    // point in the future.
    const enabledTheme = req.cookies['in-theme'];
    let theme = 'night';
    if (enabledTheme in themes) {
      theme = enabledTheme;
    }
    const themeChecksum = themes[theme].checksum;
    const themeSri = themes[theme].sri;
    const themeConfig = themes[theme].config;

    // doing this exactly three times as the template requires three nonces
    const nonces = [
      uuid.v4(),
      uuid.v4(),
      uuid.v4()
    ];

    // in demo mode we are relying on Google, Facebook and Xing sign in scripts.
    // They wreak all kinds of havoc, have inline scripts, JavaScript URLs and
    // more stuff that is just totally incompatible with CSP :-(
    if (clientConfig.environment !== 'demo') {
      let append = '';
      // if this route was called by safari -> add the unsafe inline Content-Security-Policy
      if (req.headers['user-agent'].toLowerCase().indexOf('safari') >= 0) {
        append = "'unsafe-inline' ";
      }

      res.set(
        'Content-Security-Policy',
        "script-src 'self' 'unsafe-eval' " +
          append +
          nonces.map(n => "'nonce-" + n + "'").join(' ') +
          ' https://www.google-analytics.com'
      );
    }

    res.send(compiledTemplate({
      indexJsChecksum,
      indexJsSri,
      theme,
      themeChecksum,
      themeConfig,
      themeSri,
      nonces
    }));
  });
});


function askUiBackendWhetherTheRequestIsAuthorized(req, cb) {
  sendRequest({
    url: serverConfig.uiBackendBaseUrl + '/checkUserAccessPermitted',
    headers: {
      'Cookie': 'in-token=' + req.cookies['in-token']
    },
    timeout: 1000 * 5
  }, (error, response) => {
    if (error) {
      cb(error, null, null);
    } else {
      cb(null, response.statusCode);
    }
  });
}


// support both requests with and without checksum
router.get('/bundle/index.js', sendIndexJs);
router.get('/bundle/index-*.js', sendIndexJs);

function sendIndexJs(req, res) {
  res.sendFile(
    path.join(bundleDir, 'index.js'),
    {maxAge: staticFileMaxCachingDurationMs},
    err => {
      if (err) {
        res.sendStatus(404);
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
    path.join(bundleDir, 'theme-' + themeName + '.css'),
    {maxAge: staticFileMaxCachingDurationMs},
    err => {
      if (err) {
        res.sendStatus(404);
      }
    }
  );
});
