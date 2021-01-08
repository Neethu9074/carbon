const Handlebars = require('handlebars');
const express = require('express');
const uuid = require('node-uuid');
const fs = require('fs');

const { getCurrentUser, isRequestCarryingAValidSeemingCookie } = require('../auth');
const getNumberLocaleDefinition = require('../services/numberLocale');
const { getMixpanelToken } = require('../services/mixpanel');
const buildInformation = require('../../assets/build.json');
const configResolver = require('../services/config');
const checkSumMod = require('../services/checksum');
const serverConfig = require('../serverConfig.js');
const errorPages = require('../errorPages.js');
const { getCsp } = require('../services/csp');
const fetch = require('../services/fetch');
const paths = require('../services/paths');

const router = (module.exports = express.Router());

const indexHtmlTemplate = fs.readFileSync(paths.indexHtmlTemplate, { encoding: 'utf8' });
const compiledTemplate = Handlebars.compile(indexHtmlTemplate);
const compiledRedirectTemplate = Handlebars.compile(
  fs.readFileSync(paths.redirectToSignInTemplate, { encoding: 'utf8' })
);

const indexJsChecksum = checkSumMod.getChecksumForFile(paths.indexJs);
const stringifiedBuildInformation = JSON.stringify(buildInformation);

// Module file name patterns for which a prefetch instruction should be added to the HTML
// document. Ordered by likelyhood of usage.
const modulesToPrefetch = [
  // It is very likely that either of these are configured as the landing page:
  // Prefetch with highest priority.
  /^cockpit\./i,
  /^customDashboarding\./i,

  /^infrastructure\./i,
  /^applications\./i,
  /^websites\./i,
  /^mobileApps\./i,
  /^kubernetes\./i,
  /^analyze\./i,

  /^cloudfoundry\./i,
  /^integrations\./i,
  /^layoutingWorker\./i,
  /^profiling\./i,
  /^configView\./i
];

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
  .filter(fileName => {
    // Only allow JS or CSS files as prefetch items
    if (!fileName.endsWith('.js') && !fileName.endsWith('.css')) {
      return false;
    }

    for (const regexp of modulesToPrefetch) {
      if (regexp.test(fileName)) {
        return true;
      }
    }
    return false;
  })
  .map(fileName => {
    return {
      rel: 'prefetch',
      as: fileName.endsWith('.css') ? 'style' : 'script',
      fileName
    };
  });

router.get('/', async (req, res) => {
  try {
    res.vary('*');
    res.set('cache-control', 'private, no-cache, no-store, must-revalidate, max-age=0');

    // We can cut page load time in half by executing all of the sub requests for user settings
    // etc. even before we know whether the user is properly authenticated or not. It is not
    // an issue do so because all downstream services will also check for proper authentication
    // (we just forward the cookie). However this could be abused in DOS cases as ui-client
    // would multiply each incoming call x10. To somewhat reduce the risk we will only execute
    // the sub requests permaturely when the request carries a valid looking cookie.
    // This is not a real protection, but it can reduce the impact. For everything else we will
    // have Cloudflare's DDOS protection :)
    const subRequestPromises = isRequestCarryingAValidSeemingCookie(req)
      ? initializeSubRequestPromises(req)
      : undefined;
    const [statusCode, userStr] = await getCurrentUser(req);
    if (statusCode === 401) {
      const uiClientBaseUrl = await configResolver.getBaseUrl(req.tenant, req.unit);
      const nonce = uuid.v4();
      res
        .status(401)
        .set('Content-Security-Policy', `default-src 'self'; script-src 'self' 'nonce-${nonce}'`)
        .send(
          compiledRedirectTemplate({
            signInUrl: `${uiClientBaseUrl}/auth/signIn`,
            returnUrlWithoutHash: encodeURIComponent(uiClientBaseUrl + req.originalUrl),
            nonce
          })
        );
      return;
    } else if (statusCode === 403) {
      errorPages.send403(req, res);
      return;
    } else if (statusCode < 200 || statusCode > 299) {
      console.error(
        `Server returned unknown status code ${statusCode} while trying to receive user info with user cookie.`
      );
      errorPages.send500(req, res);
      return;
    }

    const [
      userSettings,
      searchFieldsStr,
      filterTags,
      csrf,
      permissions,
      termsAndPrivacySettings,
      termsAndPrivacyAccepted,
      reportingData,
      starredItems,
      clientConfig
    ] = await (subRequestPromises || initializeSubRequestPromises(req));

    const nonce = uuid.v4();
    res.set('Content-Security-Policy', getCsp(nonce));

    const termsAndPrivacy = JSON.parse(termsAndPrivacySettings);
    res.send(
      compiledTemplate({
        indexJsChecksum,
        nonce,
        appcuesId: termsAndPrivacy.allSupportAndResearchServices && serverConfig.appcuesId,
        mixpanelToken: getMixpanelToken(getParsedUser(userStr), termsAndPrivacy.allAnalyticsServices),
        eumTrackingDomain: serverConfig.eum.domain,
        eumTrackingApiKey: serverConfig.eum.apiKey,
        eumRetrievalDomain: serverConfig.eum.retrievalDomain || serverConfig.eum.domain,
        backendTraceId: req.get('x-instana-t') || '',
        prefetchItems,
        user: userStr,
        permissions: permissions,
        config: JSON.stringify(clientConfig),
        build: stringifiedBuildInformation,
        searchFields: searchFieldsStr,
        settings: userSettings,
        tags: filterTags,
        csrf,
        numberLocale: getNumberLocaleDefinition(req),
        termsAndPrivacySettings,
        termsAndPrivacyAccepted,
        reportingData,
        starredItems
      })
    );
  } catch (e) {
    console.error('Failed to deliver index.html to user:', e.message, e);
    errorPages.send500(req, res);
  }
});

function initializeSubRequestPromises(req) {
  return Promise.all([
    getUserSettings(req),
    getSearchFields(req),
    getFilterTags(req),
    getCsrfToken(req),
    getUserPermissions(req),
    getTermsAndPrivacySettings(req),
    getLatestTermsAndPrivacyAcceptance(req),
    getIsMonitoring(req),
    getStarredItems(req),
    configResolver.getClientConfig(req, req.tenant, req.unit)
  ]);
}

async function getFromUiBackend({ req, path, resolveWithResponse = false }) {
  let response;
  try {
    response = await fetch(req.uiBackendBaseUrl + path, {
      headers: {
        Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
      },
      timeout: 15000
    });
  } catch (e) {
    throw new Error(`Failed to call GET ${path} from ui-backend: ${e.message} ${e}`);
  }

  if (!response.ok) {
    throw new Error(`Retrieved status code ${response.status} for GET ${path} from ui-backend.`);
  }

  if (resolveWithResponse) {
    return response;
  }

  return await response.text();
}

function getTermsAndPrivacySettings(req) {
  return getFromUiBackend({
    req,
    path: '/api/user-settings'
  });
}

function getLatestTermsAndPrivacyAcceptance(req) {
  return getFromUiBackend({
    req,
    path: '/api/tos-privacy-agreement/checkUserAcceptance'
  });
}

function getUserPermissions(req) {
  return getFromUiBackend({
    req,
    path: '/api/permissions'
  });
}

function getUserSettings(req) {
  return getFromUiBackend({
    req,
    path: '/api/ui/settings'
  });
}

function getSearchFields(req) {
  return getFromUiBackend({
    req,
    path: '/api/search/fields'
  });
}

function getFilterTags(req) {
  return getFromUiBackend({
    req,
    path: '/api/tags'
  });
}

async function getCsrfToken(req) {
  const response = await getFromUiBackend({
    req,
    path: '/api/csrf/token',
    resolveWithResponse: true
  });

  return JSON.stringify({
    token: response.headers.get('x-csrf-token')
  });
}

function getIsMonitoring(req) {
  return getFromUiBackend({
    req,
    path: '/api/infrastructure-monitoring/monitoring-state'
  });
}

function getStarredItems(req) {
  return getFromUiBackend({
    req,
    path: '/api/starred-item'
  });
}

function getParsedUser(userStr) {
  let user;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    return null;
  }
  return user;
}
