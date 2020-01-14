const Handlebars = require('handlebars');
const express = require('express');
const uuid = require('node-uuid');
const fs = require('fs');

const getNumberLocaleDefinition = require('../services/numberLocale');
const { getCsp, findMaxNonces } = require('../services/csp');
const buildInformation = require('../assets/build.json');
const checkSumMod = require('../services/checksum');
const serverConfig = require('../serverConfig.js');
const paths = require('../services/paths');

const router = (module.exports = express.Router());

const waitingHtmlTemplate = fs.readFileSync(paths.waitingHtmlTemplate, { encoding: 'utf8' });
const maxNonces = findMaxNonces(waitingHtmlTemplate);
const compiledTemplate = Handlebars.compile(waitingHtmlTemplate);

const waitingJsChecksum = checkSumMod.getChecksumForFile(paths.waitingJs);
const waitingCssChecksum = checkSumMod.getChecksumForFile(paths.waitingCss);
const stringifiedBuildInformation = JSON.stringify(buildInformation);

router.get('/waiting', (req, res) => {
  const nonces = Array(maxNonces)
    .fill(maxNonces)
    .map(() => uuid.v4());

  res.vary('*');
  res.set('cache-control', 'private, no-cache, no-store, must-revalidate, max-age=0');
  res.set('Content-Security-Policy', getCsp(nonces));

  res.send(
    compiledTemplate({
      waitingJsChecksum,
      waitingCssChecksum,
      nonces,
      config: JSON.stringify({
        tenant: req.tenant,
        tenantUnit: req.unit,
        agentKey: req.query.agentkey,
        tenantUnitDomainSuffix: serverConfig.clientConfig.tenantUnitDomainSuffix,
        agentEndpoint: serverConfig.clientConfig.agentEndpoint,
        agentEndpointPort: serverConfig.clientConfig.agentEndpointPort,
        region: serverConfig.clientConfig.region,
        butlerDomain: serverConfig.clientConfig.butlerDomain
      }),
      mixpanelToken: serverConfig.mixpanelToken,
      eumTrackingDomain: serverConfig.eum.domain,
      eumTrackingApiKey: serverConfig.eum.apiKey,
      eumRetrievalDomain: serverConfig.eum.retrievalDomain || serverConfig.eum.domain,
      backendTraceId: req.get('x-instana-t') || '',
      build: stringifiedBuildInformation,
      numberLocale: getNumberLocaleDefinition(req)
    })
  );
});
