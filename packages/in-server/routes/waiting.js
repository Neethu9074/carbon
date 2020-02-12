const Handlebars = require('handlebars');
const express = require('express');
const uuid = require('node-uuid');
const fs = require('fs');

const getNumberLocaleDefinition = require('../services/numberLocale');
const { activeResolver } = require('../services/resolvers/index');
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

  return Promise.all([
    activeResolver.getButlerDomain(req.tenant, req.unit),
    activeResolver.getAgentEndpointConfiguration(req.tenant, req.unit)
  ]).then(([butlerDomain, agentEndpointConfiguration]) =>
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
          region: serverConfig.clientConfig.region,
          butlerDomain: butlerDomain,
          agentEndpoint: agentEndpointConfiguration.agentEndpoint,
          agentEndpointPort: agentEndpointConfiguration.port
        }),
        mixpanelToken: serverConfig.mixpanelToken,
        eumTrackingDomain: serverConfig.eum.domain,
        eumTrackingApiKey: serverConfig.eum.apiKey,
        eumRetrievalDomain: serverConfig.eum.retrievalDomain || serverConfig.eum.domain,
        backendTraceId: req.get('x-instana-t') || '',
        build: stringifiedBuildInformation,
        numberLocale: getNumberLocaleDefinition(req)
      })
    )
  );
});
