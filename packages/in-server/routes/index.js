const Handlebars = require('handlebars');
const sendRequest = require('request');
const express = require('express');
const uuid = require('node-uuid');
const fs = require('fs');

const buildInformation = require('../assets/build.json');
const clientConfig = require('../assets/config.json');
const checkSumMod = require('../services/checksum');
const serverConfig = require('../serverConfig.js');
const errorPages = require('../errorPages.js');
const { getCurrentUser } = require('../auth');
const paths = require('../services/paths');

const router = (module.exports = express.Router());

const indexHtmlTemplate = fs.readFileSync(paths.indexHtmlTemplate, { encoding: 'utf8' });
const maxNonces = findMaxNonces(indexHtmlTemplate);
const compiledTemplate = Handlebars.compile(indexHtmlTemplate);

const indexJsSri = checkSumMod.getSriIntegrityForFile(paths.indexJs);
const indexJsChecksum = checkSumMod.getChecksumForFile(paths.indexJs);
const indexCssChecksum = checkSumMod.getChecksumForFile(paths.indexCss);
const stringifiedClientConfig = JSON.stringify(clientConfig);
const stringifiedBuildInformation = JSON.stringify(buildInformation);

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
const prefetchItems = fs
  .readdirSync(paths.bundleDir)
  .filter(fileName => /^\d+\.[a-z0-9]+\.js$/i.test(fileName))
  .map(fileName => {
    return {
      rel: 'prefetch',
      as: 'script',
      fileName
    };
  });

router.get('/', (req, res) => {
  res.vary('*');
  res.set('cache-control', 'private, no-cache, no-store, must-revalidate, max-age=0";');

  getCurrentUser(req)
    .then(([statusCode, userStr]) =>
      Promise.all([getUserSettings(req, res, statusCode, userStr), getSearchFields(req, res)])
    )
    .then(([[statusCode, userStr, userSettings], searchFieldsStr]) =>
      sendIndex(req, res, statusCode, userStr, userSettings, searchFieldsStr)
    )
    .catch(err => {
      console.error('Failed to deliver index.html to user:', err);
      errorPages.send500(req, res);
    });
});

function getUserSettings(req, res, getUserStatusCode, userStr) {
  return new Promise((resolve, reject) => {
    sendRequest(
      {
        url: serverConfig.uiBackendBaseUrl + '/api/ui/settings',
        headers: {
          Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
        },
        timeout: 5000
      },
      (error, response, userSettings) => {
        if (error) {
          reject(new Error('Failed to retrieve user settings from ui-backend: ' + String(error)));
        } else {
          resolve([response.statusCode, userStr, userSettings]);
        }
      }
    );
  });
}

function getSearchFields(req) {
  return new Promise((resolve, reject) => {
    sendRequest(
      {
        url: serverConfig.uiBackendBaseUrl + '/api/search/fields',
        headers: {
          Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
        },
        timeout: 5000
      },
      (error, response, searchFields) => {
        if (error) {
          reject(new Error('Failed to retrieve user settings from ui-backend: ' + String(error)));
        } else {
          resolve(searchFields);
        }
      }
    );
  });
}

function sendIndex(req, res, getUserStatusCode, userStr, userSettings, searchFieldsStr) {
  if (getUserStatusCode === 401) {
    const requestedAbsoluteUrl = serverConfig.baseUrl + req.originalUrl;
    res.redirect(serverConfig.baseUrl + '/auth/signIn?returnUrl=' + encodeURIComponent(requestedAbsoluteUrl));
    return;
  } else if (getUserStatusCode === 403) {
    errorPages.send403(req, res);
    return;
  } else if (getUserStatusCode < 200 || getUserStatusCode > 299) {
    console.error('Undefined state: Server returned unknown status code ' + getUserStatusCode);
    errorPages.send500(req, res);
    return;
  }

  const nonces = Array(maxNonces)
    .fill(maxNonces)
    .map(i => uuid.v4());

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
      ' https://www.google-analytics.com https://cdn.mxpnl.com *.instana.io'
  );

  res.send(
    compiledTemplate({
      indexJsChecksum,
      indexJsSri,
      indexCssChecksum,
      nonces,
      googleAnalyticsTrackingId: serverConfig.googleAnalyticsTrackingId,
      eumTrackingDomain: serverConfig.eum.domain,
      eumTrackingApiKey: serverConfig.eum.apiKey,
      mixpanelToken: serverConfig.mixpanelToken,
      backendTraceId: req.get('x-instana-t') || '',
      prefetchItems,
      user: userStr,
      config: stringifiedClientConfig,
      build: stringifiedBuildInformation,
      searchFields: searchFieldsStr,
      settings: userSettings
    })
  );
}

function findMaxNonces(indexHtmlTemplate) {
  const nonceMatches = indexHtmlTemplate.match(/nonces\.\[\d+\]/gi);
  if (nonceMatches) {
    const nonceIndices = nonceMatches.map(match => parseInt(/nonces\.\[(\d+)\]/i.exec(match)[1]));
    return Math.max(...nonceIndices) + 1;
  }
  return 0;
}
