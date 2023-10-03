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

allowedScriptOrigins.push('https://cdn.walkme.com');
allowedScriptOrigins.push('https://playerserver.walkme.com');
allowedScriptOrigins.push('https://ec.walkme.com');

if (serverConfig.appcuesId) {
  allowedScriptOrigins.push('https://fast.appcues.com');
}

const allowedScriptOriginsForTrialUsers = [...allowedScriptOrigins, 'https://www.ibm.com'];

exports.getCsp = (nonce, isTrialUser) => {
  if (isTrialUser) {
    return `script-src 'self' 'nonce-${nonce}' ${allowedScriptOriginsForTrialUsers.join(' ')}`;
  } else {
    return `script-src 'self' 'nonce-${nonce}' ${allowedScriptOrigins.join(' ')}`;
  }
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
