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

const allowedScriptOriginsForTrialOrNotForResaleUser = [...allowedScriptOrigins, 'https://www.ibm.com'];

exports.getCsp = (nonce, isTrialOrNotForResaleUser) => {
  if (isTrialOrNotForResaleUser) {
    return `script-src 'self' 'nonce-${nonce}' ${allowedScriptOriginsForTrialOrNotForResaleUser.join(' ')}`;
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
