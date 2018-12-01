const Handlebars = require('handlebars');
const sendRequest = require('request');
const express = require('express');
const uuid = require('node-uuid');
const fs = require('fs');

const getNumberLocaleDefinition = require('../services/numberLocale');
const buildInformation = require('../assets/build.json');
const checkSumMod = require('../services/checksum');
const serverConfig = require('../serverConfig.js');
const errorPages = require('../errorPages.js');
const { getCurrentUser } = require('../auth');
const paths = require('../services/paths');

const router = (module.exports = express.Router());

const indexHtmlTemplate = fs.readFileSync(paths.indexHtmlTemplate, { encoding: 'utf8' });
const maxNonces = findMaxNonces(indexHtmlTemplate);
const compiledTemplate = Handlebars.compile(indexHtmlTemplate);
const compiledRedirectTemplate = Handlebars.compile(fs.readFileSync(paths.redirectToSignInTemplate, { encoding: 'utf8' }));

const indexJsSri = checkSumMod.getSriIntegrityForFile(paths.indexJs);
const indexJsChecksum = checkSumMod.getChecksumForFile(paths.indexJs);
const indexCssChecksum = checkSumMod.getChecksumForFile(paths.indexCss);
const stringifiedClientConfig = JSON.stringify(serverConfig.clientConfig);
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
  .filter(fileName => /^.*\.[a-z0-9]+\.js$/i.test(fileName))
  // There are just way too many Ammap files. No need to prefetch all of them.
  .filter(fileName => fileName.indexOf('AmMap') === -1)
  .map(fileName => {
    return {
      rel: 'prefetch',
      as: 'script',
      fileName
    };
  });

router.get('/', (req, res) => {
  res.vary('*');
  res.set('cache-control', 'private, no-cache, no-store, must-revalidate, max-age=0');

  getCurrentUser(req)
    .then(([statusCode, userStr]) => {
      if (statusCode === 401) {
        sendUnauthorizedResponse(req, res);
        return;
      }

      return Promise.all([
        getUserSettings(req, res, statusCode, userStr),
        getSearchFields(req, res),
        getFilterTags(req, res),
        getCsrfToken(req)
      ])
      .then(([[statusCode, userStr, userSettings], searchFieldsStr, filterTags, csrf]) =>
        sendIndex(req, res, statusCode, userStr, userSettings, searchFieldsStr, filterTags, csrf)
      );
    })
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

function getFilterTags(req) {
  return new Promise((resolve, reject) => {
    sendRequest(
      {
        url: serverConfig.uiBackendBaseUrl + '/api/tags',
        headers: {
          Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
        },
        timeout: 5000
      },
      (error, response, tags) => {
        if (error) {
          reject(new Error('Failed to retrieve filter tags from ui-backend: ' + String(error)));
        } else {
          resolve(tags);
        }
      }
    );
  });
}

function getCsrfToken(req) {
  return new Promise((resolve, reject) => {
    sendRequest(
      {
        url: serverConfig.uiBackendBaseUrl + '/api/csrf/token',
        headers: {
          Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
        },
        timeout: 5000
      },
      (error, response) => {
        if (error) {
          reject(new Error('Failed to retrieve csrf token from ui-backend: ' + String(error)));
        } else {
          resolve(JSON.stringify({
            token: response.headers['x-csrf-token']
          }));
        }
      }
    );
  });
}

function sendIndex(req, res, getUserStatusCode, userStr, userSettings, searchFieldsStr, filterTags, csrf) {
  if (getUserStatusCode === 401) {
    sendUnauthorizedResponse(req, res);
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
    .map(() => uuid.v4());

  let cspExtensions = '';
  // Ff this route was called by safari -> add the unsafe inline Content-Security-Policy
  // as it has no nonce support.
  if (!supportsCspNonces(req)) {
    cspExtensions = "'unsafe-inline' ";
  }

  res.set(
    'Content-Security-Policy',
    "script-src 'self' " +
      cspExtensions +
      nonces.map(n => "'nonce-" + n + "'").join(' ') +
      ' https://www.google-analytics.com https://cdn.mxpnl.com https://fast.appcues.com *.instana.io'
  );

  res.send(
    compiledTemplate({
      indexJsChecksum,
      indexJsSri,
      indexCssChecksum,
      nonces,
      googleAnalyticsTrackingId: serverConfig.googleAnalyticsTrackingId,
      appcuesId: serverConfig.appcuesId,
      mixpanelToken: serverConfig.mixpanelToken,
      eumTrackingDomain: serverConfig.eum.domain,
      eumTrackingApiKey: serverConfig.eum.apiKey,
      eumRetrievalDomain: serverConfig.eum.retrievalDomain || serverConfig.eum.domain,
      backendTraceId: req.get('x-instana-t') || '',
      prefetchItems,
      user: userStr,
      config: stringifiedClientConfig,
      build: stringifiedBuildInformation,
      searchFields: searchFieldsStr,
      settings: userSettings,
      tags: filterTags,
      csrf,
      numberLocale: getNumberLocaleDefinition(req)
    })
  );
}

function sendUnauthorizedResponse(req, res) {
  res.status(401).send(
    compiledRedirectTemplate({
      signInUrl: serverConfig.baseUrl + '/auth/signIn',
      returnUrlWithoutHash: encodeURIComponent(serverConfig.baseUrl + req.originalUrl)
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

function supportsCspNonces(req) {
  let userAgent = req.headers['user-agent'];
  if (!userAgent) {
    return false;
  }

  userAgent = userAgent.toLowerCase();
  return userAgent.indexOf('safari') === -1 || userAgent.indexOf('chrome') !== -1;
}
