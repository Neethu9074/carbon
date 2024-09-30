/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const { v4: uuidv4 } = require('uuid');
const Handlebars = require('handlebars');
const express = require('express');
const fs = require('fs');

const { getCurrentUser, isRequestCarryingAValidSeemingCookie } = require('../auth');
const getNumberLocaleDefinition = require('../services/numberLocale');
const { getMixpanelToken } = require('../services/mixpanel');
const { getSegmentKey } = require('../services/segment');
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
const compStyleCssChecksum = checkSumMod.getChecksumForFile(paths.compStyleCss);
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

    if (subRequestPromises) {
      // we face uncaught promise rejections whenever users have a valid seeming cookie pointing
      // to an expired session. In those cases, the subRequestPromises are never handled,
      // because we return in the function before the subRequestPromises are listened to.
      //
      // We do not have to properly handle errors in this code path. Down below we handle
      // subRequestPromises if (and only if) handling of these errors are truly necessary.
      subRequestPromises.catch(() => {});
    }

    const [statusCode, userStr] = await getCurrentUser(req);
    if (statusCode === 401) {
      const uiClientBaseUrl = await configResolver.getBaseUrl(req.tenant, req.unit);
      const clientConfig = await configResolver.getClientConfig(req, req.tenant, req.unit);
      const nonce = uuidv4();
      if (clientConfig.featureFlags?.playwithEnabled) {
        res.status(401).send(
          compiledRedirectTemplate({
            signInUrl: `https://www.ibm.com/account/reg/us-en/signup?formid=urx-52153&`
          })
        );
      } else {
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
      }
      return;
    } else if (statusCode === 403) {
      const uiClientBaseUrl = await configResolver.getBaseUrl(req.tenant, req.unit);
      const nonce = uuidv4();
      errorPages.send403(
        req,
        res,
        getParsedUser(userStr),
        `${uiClientBaseUrl}/auth/signOut`,
        encodeURIComponent(uiClientBaseUrl + req.originalUrl),
        nonce
      );
      return;
    } else if (statusCode < 200 || statusCode > 299) {
      req.log.error(
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
      getLicenseInfo,
      clientConfig
    ] = await (subRequestPromises || initializeSubRequestPromises(req));

    const nonce = uuidv4();
    const loggedUser = getParsedUser(userStr);
    clientConfig.walkmeUuid = loggedUser;
    clientConfig.segmentKey = getSegmentKey();
    const activeLicenseInfo = JSON.parse(getLicenseInfo)?.type;
    clientConfig.activeLicenseType = activeLicenseInfo;
    const termsAndPrivacy = JSON.parse(termsAndPrivacySettings);
    const injectWalkMeScript =
      clientConfig.featureFlags?.playwithEnabled || clientConfig.featureFlags?.playWithReleaseEnabled;
    const isAssistMeEnabled = clientConfig.featureFlags?.assistmeEnabled;
    const injectWalkMeTestScript = clientConfig.featureFlags?.playwithTestEnabled;
    res.set('Content-Security-Policy', getCsp(nonce, isAssistMeEnabled, injectWalkMeScript || injectWalkMeTestScript));
    res.send(
      compiledTemplate({
        indexJsChecksum,
        compStyleCssChecksum,
        nonce,
        appcuesId: termsAndPrivacy.allSupportAndResearchServices && serverConfig.appcuesId,
        mixpanelToken: getMixpanelToken(loggedUser, termsAndPrivacy.allAnalyticsServices),
        eumTrackingDomain: serverConfig.eum.domain,
        eumTrackingApiKey: serverConfig.eum.apiKey,
        eumRetrievalDomain: serverConfig.eum.retrievalDomain || serverConfig.eum.domain,
        eumEnableSri: serverConfig.eum.enableSri,
        eumAgentVersion: serverConfig.eum.agentVersion,
        eumAgentSri: serverConfig.eum.agentSri,
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
        starredItems,
        injectWalkMeScript,
        isAssistMeEnabled,
        injectWalkMeTestScript
      })
    );
  } catch (err) {
    req.log.error({ err }, 'Failed to deliver index.html to user');
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
    getLicenseInfo(req),
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

function getLicenseInfo(req) {
  return getFromUiBackend({
    req,
    path: '/api/license'
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
