/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const Handlebars = require('handlebars');
const express = require('express');
const fs = require('fs');

const serverConfig = require('../serverConfig.js');
const paths = require('../services/paths');

const router = (module.exports = express.Router());

const compiledTemplate = Handlebars.compile(fs.readFileSync(paths.maximumCookiesTemplate, { encoding: 'utf8' }));

router.get('/maximumCookies', (req, res) => {
  res.cookie(serverConfig.cookie.name, 'random value for cookie bot', { maxAge: 900000, httpOnly: true, secure: true });
  res.send(
    compiledTemplate({
      eumTrackingDomain: serverConfig.eum.domain,
      eumTrackingApiKey: serverConfig.eum.apiKey,
      eumRetrievalDomain: serverConfig.eum.retrievalDomain || serverConfig.eum.domain,
      eumEnableSri: serverConfig.eum.enableSri,
      eumAgentVersion: serverConfig.eum.agentVersion,
      eumAgentSri: serverConfig.eum.agentSri,
      backendTraceId: req.get('x-instana-t') || ''
    })
  );
});
