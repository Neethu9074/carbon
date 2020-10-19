const Handlebars = require('handlebars');
const express = require('express');
const uuid = require('node-uuid');
const fs = require('fs');

const getNumberLocaleDefinition = require('../services/numberLocale');
const { activeResolver } = require('../services/resolvers/index');
const buildInformation = require('../../assets/build.json');
const { getCsrfToken } = require('../services/csrf');
const configResolver = require('../services/config');
const checkSumMod = require('../services/checksum');
const serverConfig = require('../serverConfig.js');
const { getCsp } = require('../services/csp');
const fetch = require('../services/fetch');
const paths = require('../services/paths');

const router = (module.exports = express.Router());

const waitingHtmlTemplate = fs.readFileSync(paths.waitingHtmlTemplate, { encoding: 'utf8' });
const compiledTemplate = Handlebars.compile(waitingHtmlTemplate);

const waitingJsChecksum = checkSumMod.getChecksumForFile(paths.waitingJs);
const stringifiedBuildInformation = JSON.stringify(buildInformation);

router.get('/waiting', (req, res) => {
  const nonce = uuid.v4();

  res.vary('*');
  res.set('cache-control', 'private, no-cache, no-store, must-revalidate, max-age=0');
  res.set('Content-Security-Policy', getCsp(nonce));

  return Promise.all([
    configResolver.getButlerBaseUrl(req.tenant, req.unit),
    activeResolver.getButlerDomain(req.tenant, req.unit),
    activeResolver.getReportingEndpoints(req, req.tenant, req.unit)
  ]).then(([butlerBaseUrl, butlerDomain, reportingEndpoints]) => {
    return Promise.all([
      getLatestTermsAndPrivacyAcceptance(req, butlerBaseUrl),
      getCurrentUserFromButler(req, butlerBaseUrl),
      getCsrfToken(req)
    ])
      .then(([termsAndPrivacyAccepted, [statusCode, userStr], csrfToken]) => {
        if (statusCode < 200 || statusCode > 299) {
          sendWaitingIndex(req, res, nonce, butlerDomain, reportingEndpoints);
        } else {
          sendWaitingIndex(
            req,
            res,
            nonce,
            butlerDomain,
            reportingEndpoints,
            csrfToken,
            userStr,
            termsAndPrivacyAccepted
          );
        }
      })
      .catch(error => {
        console.log('Failed to fetch user and ToS-acceptance from butler: %s', error.message);
        return sendWaitingIndex(req, res, nonce, butlerDomain, reportingEndpoints);
      });
  });
});

function sendWaitingIndex(req, res, nonce, butlerDomain, reportingEndpoints, csrf, userStr, termsAndPrivacyAccepted) {
  res.send(
    compiledTemplate({
      waitingJsChecksum,
      nonce,
      config: JSON.stringify({
        tenant: req.tenant,
        tenantUnit: req.unit,
        agentKey: req.query.agentkey,
        tenantUnitDomainSuffix: serverConfig.clientConfig.tenantUnitDomainSuffix,
        region: serverConfig.clientConfig.region,
        butlerDomain: butlerDomain,

        agentEndpoint: reportingEndpoints.agentEndpoint,
        agentEndpointPort: reportingEndpoints.port,
        websiteScriptSource: reportingEndpoints.websiteScriptSource,
        websiteEndpoint: reportingEndpoints.websiteEndpoint,
        mobileEndpoint: reportingEndpoints.mobileEndpoint,
        serverlessEndpoint: reportingEndpoints.serverlessEndpoint
      }),
      csrf: JSON.stringify({
        token: csrf
      }),
      mixpanelToken: serverConfig.mixpanelToken,
      eumTrackingDomain: serverConfig.eum.domain,
      eumTrackingApiKey: serverConfig.eum.apiKey,
      eumRetrievalDomain: serverConfig.eum.retrievalDomain || serverConfig.eum.domain,
      backendTraceId: req.get('x-instana-t') || '',
      build: stringifiedBuildInformation,
      numberLocale: getNumberLocaleDefinition(req),
      user: userStr,
      termsAndPrivacyAccepted: termsAndPrivacyAccepted == 'true'
    })
  );
}

async function getLatestTermsAndPrivacyAcceptance(req, butlerBaseUrl) {
  const response = await fetch(`${butlerBaseUrl}/tos-privacy-agreement/checkUserAcceptance`, {
    headers: {
      Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
    },
    timeout: 15000
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve latest tos acceptance from butler. Got status: ${response.status}`);
  }

  const body = await response.text();
  return body;
}

async function getCurrentUserFromButler(req, butlerBaseUrl) {
  const cookieValue = req.cookies[serverConfig.cookie.name];
  if (cookieValue == null || typeof cookieValue !== 'string' || cookieValue.trim().length < 5) {
    return [401, null];
  }

  const response = await fetch(`${butlerBaseUrl}/tos-privacy-agreement/checkUserAccessPermitted`, {
    headers: {
      Cookie: `${serverConfig.cookie.name}=${cookieValue}`
    },
    timeout: 15000
  });

  const body = await response.text();
  return [response.status, body];
}
