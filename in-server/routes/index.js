const Handlebars = require('handlebars');
const sendRequest = require('request');
const express = require('express');
const uuid = require('node-uuid');
const path = require('path');
const fs = require('fs');

const searchFields = require('../services/searchFields');
const buildInformation = require('../assets/build.json');
const clientConfig = require('../assets/config.json');
const checkSumMod = require('../services/checksum');
const serverConfig = require('../serverConfig.js');
const errorPages = require('../errorPages.js');
const paths = require('../services/paths');

const router = module.exports = express.Router();

const compiledTemplate = Handlebars.compile(
  fs.readFileSync(paths.indexHtmlTemplate, {encoding: 'utf8'})
);


const indexJsSri = checkSumMod.getSriIntegrityForFile(paths.indexJs);
const indexJsChecksum = checkSumMod.getChecksumForFile(paths.indexJs);
const stringifiedClientConfig = JSON.stringify(clientConfig);
const stringifiedBuildInformation = JSON.stringify(buildInformation);


// Object used to look up theme information for embedding of CSS and
// theme variables.
//
// Structure
// {
//   <themeName>: {
//     fileName,
//     checksum,
//     sri,
//     config
//   }
// }
const themes = fs.readdirSync(paths.bundleDir)
  .reduce((themeHashes, fileName) => {
    const match = fileName.match(/^theme-(\w+)\.css$/);
    if (match) {
      const themeName = match[1];
      const themeConfig = fs.readFileSync(
        path.join(paths.assetDir, themeName, 'config.json'),
        {encoding: 'utf8'}
      );
      const fullFilePath = path.join(paths.bundleDir, fileName);
      themeHashes[themeName] = {
        fileName,
        checksum: checkSumMod.getChecksumForFile(fullFilePath),
        sri: checkSumMod.getSriIntegrityForFile(fullFilePath),
        // parse & stringify to remove all extra whitespace. Basically "minify"
        // the JSON.
        config: JSON.stringify(JSON.parse(themeConfig))
      };
    }
    return themeHashes;
  }, {});


// Array of all the JS chunks which may be prefetched by the browser
//
// Structure
// [
//   {
//     rel,
//     as,
//     fileName
//   }
// ]
const prefetchItems = fs.readdirSync(paths.bundleDir)
  .filter(fileName => /^\d+\.[a-z0-9]+\.js$/i.test(fileName))
  .map(fileName => {
    return {
      rel: 'prefetch',
      as: 'script',
      fileName
    };
  });


router.get('/', (req, res) => {
  getCurrentUser(req)
    .then(([statusCode, userStr]) => sendIndex(req, res, statusCode, userStr))
    .catch(err => {
      console.error('Failed to deliver index.html to user:', err);
      errorPages.send500(req, res);
    });
});


function getCurrentUser(req) {
  return new Promise((resolve, reject) => {
    sendRequest({
      url: serverConfig.uiBackendBaseUrl + '/checkUserAccessPermitted',
      headers: {
        'Cookie': `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
      },
      timeout: 5000
    }, (error, response, userStr) => {
      if (error) {
        reject(new Error('Failed to retrieve current user from ui-backend: ' + String(error)));
      } else {
        resolve([response.statusCode, userStr]);
      }
    });
  });
}


function sendIndex(req, res, getUserStatusCode, userStr) {
  if (getUserStatusCode === 401) {
    const requestedAbsoluteUrl = serverConfig.baseUrl + req.originalUrl;
    res.redirect(
      serverConfig.baseUrl + '/auth/signIn?returnUrl=' + encodeURIComponent(requestedAbsoluteUrl)
    );
    return;
  } else if (getUserStatusCode === 403) {
    errorPages.send403(req, res);
    return;
  } else if (getUserStatusCode < 200 || getUserStatusCode > 299) {
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

  let cspExtensions = '';
  // Ff this route was called by safari -> add the unsafe inline Content-Security-Policy
  // as it has no nonce support.
  if (req.headers['user-agent'].toLowerCase().indexOf('safari') >= 0) {
    cspExtensions = "'unsafe-inline' ";
  }

  res.set(
    'Content-Security-Policy',
    "script-src 'self' " +
      cspExtensions +
      nonces.map(n => "'nonce-" + n + "'").join(' ') +
      ' https://www.google-analytics.com *.instana.io'
  );

  res.send(compiledTemplate({
    indexJsChecksum,
    indexJsSri,
    theme,
    themeChecksum,
    themeConfig,
    themeSri,
    nonces,
    googleAnalyticsTrackingId: serverConfig.googleAnalyticsTrackingId,
    eumTrackingDomain: serverConfig.eum.domain,
    eumTrackingApiKey: serverConfig.eum.apiKey,
    backendTraceId: req.get('x-instana-t') || '',
    prefetchItems,
    user: userStr,
    config: stringifiedClientConfig,
    build: stringifiedBuildInformation,
    searchFields: searchFields.searchFieldsStr
  }));
}
