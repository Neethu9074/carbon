/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
const { get } = require('lodash');

const serverConfig = require('../serverConfig.js');

const allowedScriptOrigins = ['*.instana.io'];

if (isRequiringInstanaRocks()) {
  allowedScriptOrigins.push('*.instana.rocks');
}

if (serverConfig.mixpanelToken) {
  allowedScriptOrigins.push('https://cdn.mxpnl.com');
}

if (serverConfig.appcuesId) {
  allowedScriptOrigins.push('https://fast.appcues.com');
}

exports.getCsp = nonce => {
  return `script-src 'self' 'nonce-${nonce}' ${allowedScriptOrigins.join(' ')}`;
};

function isRequiringInstanaRocks() {
  return (
    isInstanaRocks(get(serverConfig, ['eum', 'domain'])) ||
    isInstanaRocks(get(serverConfig, ['eum', 'retrievalDomain']))
  );
}

function isInstanaRocks(s) {
  return (s || '').indexOf('.instana.rocks') !== -1;
}
