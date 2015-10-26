import express from 'express';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import uuid from 'node-uuid';
import sendRequest from 'request';

import serverConfig from './serverConfig.js';
import clientConfig from './assets/config.json';
import {getChecksumForFile} from './checksum';

const router = express.Router();
export default router;


const rawTemplate = fs.readFileSync(
  path.join(__dirname, 'templates', 'index.hbs'),
  {encoding: 'utf8'}
);
const compiledTemplate = Handlebars.compile(rawTemplate);

const assetDir = path.join(__dirname, 'assets');
const bundleDir = path.join(assetDir, 'bundle');

const indexJsChecksum = getChecksumForFile(path.join(bundleDir, 'index.js'));
const themes = fs.readdirSync(bundleDir)
  .reduce((themeHashes, fileName) => {
    const match = fileName.match(/^theme-(\w+)\.css$/);
    if (match) {
      const themeName = match[1];
      const themeConfig = fs.readFileSync(
        path.join(__dirname, 'assets', themeName, 'config.json'),
        {encoding: 'utf8'}
      );
      themeHashes[themeName] = {
        fileName,
        checksum: getChecksumForFile(path.join(bundleDir, fileName)),
        // parse & stringify to remove all extra whitespace. Basically "minify"
        // the JSON.
        config: JSON.stringify(JSON.parse(themeConfig))
      };
    }
    return themeHashes;
  }, {});

// assets directory will be populated with generated JavaScript during the build process.
router.use(express.static(assetDir));


router.get('/', (req, res) => {
  askUiBackendWhetherTheRequestIsAuthorized(req, (err, status) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
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
      res.sendStatus(403).send('Access denied!');
      return;
    } else if (status < 200 || status > 299) {
      console.error('Undefined state: Server returned unknown status code ' + status);
      res.sendStatus(500);
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
          ' https://www.google-analytics.com'
      );
    }

    res.send(compiledTemplate({
      indexJsChecksum,
      theme,
      themeChecksum,
      themeConfig,
      nonces
    }));
  });
});


function askUiBackendWhetherTheRequestIsAuthorized(req, cb) {
  sendRequest({
    url: serverConfig.uiBackendBaseUrl + '/checkUserAccessPermitted',
    headers: {
      'Cookie': 'in-token=' + req.cookies['in-token']
    }
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
    err => {
      if (err) {
        res.sendStatus(404);
      }
    }
  );
});
