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
const compiledRedirectTemplate = Handlebars.compile(
  fs.readFileSync(paths.redirectToSignInTemplate, { encoding: 'utf8' })
);

const indexJsChecksum = checkSumMod.getChecksumForFile(paths.indexJs);
const indexCssChecksum = checkSumMod.getChecksumForFile(paths.indexCss);
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
  .filter(fileName => /^.*\.[a-z0-9]+\.(js|css)$/i.test(fileName))
  // There are just way too many Ammap files. No need to prefetch all of them.
  .filter(fileName => fileName.indexOf('AmMap') === -1)
  // never attempt to preload the internal bundle
  .filter(fileName => fileName.indexOf('internal') === -1)
  .map(fileName => {
    return {
      rel: 'prefetch',
      as: fileName.endsWith('css') ? 'style' : 'script',
      fileName
    };
  });

router.get('/', (req, res) => {
  res.vary('*');
  res.set('cache-control', 'private, no-cache, no-store, must-revalidate, max-age=0');

  getCurrentUser(req)
    .then(([statusCode, userStr]) => {
      if (statusCode === 401) {
        res.status(401).send(
          compiledRedirectTemplate({
            signInUrl: `${req.uiClientBaseUrl}/auth/signIn`,
            returnUrlWithoutHash: encodeURIComponent(req.uiClientBaseUrl + req.originalUrl)
          })
        );
        return;
      } else if (statusCode === 403) {
        errorPages.send403(req, res);
        return;
      } else if (statusCode < 200 || statusCode > 299) {
        console.error('Undefined state: Server returned unknown status code ' + statusCode);
        errorPages.send500(req, res);
        return;
      }

      return Promise.all([
        getUserSettings(req),
        getSearchFields(req),
        getFilterTags(req),
        getCsrfToken(req),
        getUserPermissions(req),
        getTermsAndPrivacySettings(req),
        getLatestTermsAndPrivacyAcceptance(req)
      ]).then(
        ([
          userSettings,
          searchFieldsStr,
          filterTags,
          csrf,
          permissions,
          termsAndPrivacySettings,
          termsAndPrivacyAccepted
        ]) =>
          sendIndex(
            req,
            res,
            userStr,
            userSettings,
            searchFieldsStr,
            filterTags,
            csrf,
            permissions,
            termsAndPrivacySettings,
            termsAndPrivacyAccepted
          )
      );
    })
    .catch(err => {
      console.error('Failed to deliver index.html to user:', err);
      errorPages.send500(req, res);
    });
});

function getTermsAndPrivacySettings(req) {
  return new Promise((resolve, reject) => {
    sendRequest(
      {
        url: req.uiBackendBaseUrl + '/api/user-settings',
        headers: {
          Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
        },
        timeout: 15000
      },
      (error, response, termsAndPrivacySettings) => {
        if (error) {
          reject(new Error('Failed to retrieve user settings form tos and privacy from ui-backend: ' + String(error)));
        } else {
          resolve(termsAndPrivacySettings);
        }
      }
    );
  });
}

function getLatestTermsAndPrivacyAcceptance(req) {
  return new Promise((resolve, reject) => {
    sendRequest(
      {
        url: req.uiBackendBaseUrl + '/api/tos-privacy-agreement/checkUserAcceptance',
        headers: {
          Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
        },
        timeout: 15000
      },
      (error, response, termsAndPrivacyAcceptance) => {
        if (error) {
          reject(new Error('Failed to retrieve latest tos acceptance from ui-backend: ' + String(error)));
        } else {
          resolve(termsAndPrivacyAcceptance);
        }
      }
    );
  });
}

function getUserPermissions(req) {
  return new Promise((resolve, reject) => {
    sendRequest(
      {
        url: req.uiBackendBaseUrl + '/api/permissions',
        headers: {
          Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
        },
        timeout: 15000
      },
      (error, response, userSettings) => {
        if (error) {
          reject(new Error('Failed to retrieve user permissions from ui-backend: ' + String(error)));
        } else {
          resolve(userSettings);
        }
      }
    );
  });
}

function getUserSettings(req) {
  return new Promise((resolve, reject) => {
    sendRequest(
      {
        url: req.uiBackendBaseUrl + '/api/ui/settings',
        headers: {
          Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
        },
        timeout: 15000
      },
      (error, response, userSettings) => {
        if (error) {
          reject(new Error('Failed to retrieve user settings from ui-backend: ' + String(error)));
        } else {
          resolve(userSettings);
        }
      }
    );
  });
}

function getSearchFields(req) {
  return new Promise((resolve, reject) => {
    sendRequest(
      {
        url: req.uiBackendBaseUrl + '/api/search/fields',
        headers: {
          Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
        },
        timeout: 15000
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
        url: req.uiBackendBaseUrl + '/api/tags',
        headers: {
          Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
        },
        timeout: 15000
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
        url: req.uiBackendBaseUrl + '/api/csrf/token',
        headers: {
          Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
        },
        timeout: 15000
      },
      (error, response) => {
        if (error) {
          reject(new Error('Failed to retrieve csrf token from ui-backend: ' + String(error)));
        } else {
          resolve(
            JSON.stringify({
              token: response.headers['x-csrf-token']
            })
          );
        }
      }
    );
  });
}

function sendIndex(
  req,
  res,
  userStr,
  userSettings,
  searchFieldsStr,
  filterTags,
  csrf,
  permissions,
  termsAndPrivacySettings,
  termsAndPrivacyAccepted
) {
  const nonces = Array(maxNonces)
    .fill(maxNonces)
    .map(() => uuid.v4());

  const termsAndPrivacy = JSON.parse(termsAndPrivacySettings);

  res.set(
    'Content-Security-Policy',
    "script-src 'self' " +
      nonces.map(n => "'nonce-" + n + "'").join(' ') +
      ' https://www.google-analytics.com https://cdn.mxpnl.com https://static.zdassets.com https://ekr.zdassets.com https://instana.zendesk.com wss://instana.zendesk.com https://fast.appcues.com *.instana.io'
  );

  res.send(
    compiledTemplate({
      indexJsChecksum,
      indexCssChecksum,
      nonces,
      googleAnalyticsTrackingId: termsAndPrivacy.allAnalyticsServices && serverConfig.googleAnalyticsTrackingId,
      appcuesId: termsAndPrivacy.allSupportAndResearchServices && serverConfig.appcuesId,
      mixpanelToken: termsAndPrivacy.allAnalyticsServices && serverConfig.mixpanelToken,
      eumTrackingDomain: serverConfig.eum.domain,
      eumTrackingApiKey: serverConfig.eum.apiKey,
      eumRetrievalDomain: serverConfig.eum.retrievalDomain || serverConfig.eum.domain,
      backendTraceId: req.get('x-instana-t') || '',
      prefetchItems,
      user: userStr,
      permissions: permissions,
      config: stringifyClientConfig(req.clientConfig, termsAndPrivacy.allSupportAndResearchServices),
      build: stringifiedBuildInformation,
      searchFields: searchFieldsStr,
      settings: userSettings,
      tags: filterTags,
      csrf,
      numberLocale: getNumberLocaleDefinition(req),
      termsAndPrivacySettings,
      termsAndPrivacyAccepted
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

function stringifyClientConfig(clientConfig, zendeskAllowedByUser) {
  if (!zendeskAllowedByUser) {
    delete clientConfig.zendeskKey;
  }
  return JSON.stringify(clientConfig);
}
