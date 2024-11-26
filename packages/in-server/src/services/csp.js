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

if (serverConfig.appcuesId) {
  allowedScriptOrigins.push('https://fast.appcues.com');
}

const allowedScriptOriginsWalkMe = [
  ...allowedScriptOrigins,
  'https://cdn.walkme.com',
  'https://playerserver.walkme.com',
  'https://ec.walkme.com'
];
const allowedScriptOriginsAssistMe = [...allowedScriptOriginsWalkMe, 'https://www.ibm.com'];

exports.getCsp = (nonce, isAssistMeEnabled, injectWalkMeScript) => {
  if (injectWalkMeScript) {
    return `script-src 'self' 'nonce-${nonce}' ${allowedScriptOriginsWalkMe.join(' ')}`;
  } else if (isAssistMeEnabled) {
    return `script-src 'self' 'nonce-${nonce}' ${allowedScriptOriginsAssistMe.join(' ')}`;
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
