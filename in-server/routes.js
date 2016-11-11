const express = require('express');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const uuid = require('node-uuid');
const sendRequest = require('request');

const errorPages = require('./errorPages.js');
const serverConfig = require('./serverConfig.js');
const clientConfig = require('./assets/config.json');
const checkSumMod = require('./checksum');
const getChecksumForFile = checkSumMod.getChecksumForFile;
const getSriIntegrityForFile = checkSumMod.getSriIntegrityForFile;

const router = module.exports = express.Router();
const immutableCacheControlHeader = 'max-age=365000000, immutable';

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
  cacheControl: false,
  setHeaders(res) {
    res.setHeader('Cache-Control', immutableCacheControlHeader);
  }
}));


router.get('/', (req, res) => {
  askUiBackendWhetherTheRequestIsAuthorized(req, (err, status) => {
    if (err) {
      console.error('Failed to communicate with the UI-backend:', err);
      errorPages.send500(req, res);
      return;
    }

    if (status === 401) {
      const requestedAbsoluteUrl = serverConfig.baseUrl + req.originalUrl;
      res.redirect(
        serverConfig.baseUrl + '/auth/signIn?returnUrl=' + encodeURIComponent(requestedAbsoluteUrl)
      );
      return;
    } else if (status === 403) {
      errorPages.send403(req, res);
      return;
    } else if (status < 200 || status > 299) {
      console.error('Undefined state: Server returned unknown status code ' + status);
      errorPages.send500(req, res);
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
        "script-src 'self' " +
          append +
          nonces.map(n => "'nonce-" + n + "'").join(' ') +
          ' https://www.google-analytics.com *.instana.io:447 *.instana.io'
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
      'Cookie': `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
    },
    timeout: 5000
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
    {
      headers: {
        'Cache-Control': immutableCacheControlHeader
      }
    },
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
    path.join(bundleDir, 'theme-' + themeName + '.css'),
    {
      headers: {
        'Cache-Control': immutableCacheControlHeader
      }
    },
    err => {
      if (err) {
        res.sendStatus(404);
      }
    }
  );
});
