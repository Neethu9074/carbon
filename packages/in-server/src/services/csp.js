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

const allowedScriptOriginsTrustArc = [
  'http://*.trustarc.com',
  'https://*.trustarc.com',
  'https://*.prefmgr-cookie.truste-svc.net',
  'http://*.prefmgr-cookie.truste-svc.net'
];
const allowedScriptOriginsTealium = [
  'http://*.tealium.com',
  'https://*.tags.tiqcdn.com',
  'http://*.tealium.com',
  'http://*.tags.tiqcdn.com'
];

const allowedScriptOriginsIbmCommon = [
  ...allowedScriptOrigins,
  ...allowedScriptOriginsTealium,
  ...allowedScriptOriginsTrustArc,
  'https://www.ibm.com',
  'https://1.www.s81c.com/',
  'https://www-api.ibm.com',
  'https://tags.tiqcdn.com',
  'https://cloud.ibm.com',
  'https://cdn.segment.com'
];

const allowedScriptOriginsWalkMe = [
  ...allowedScriptOriginsIbmCommon,
  'https://cdn.walkme.com',
  'https://playerserver.walkme.com',
  'https://ec.walkme.com'
];

const allowedScriptOriginsWalkMePlayBack = [
  ...allowedScriptOriginsWalkMe,
  'https://playback-assets.walkme.com',
  'https://ec-playback.walkme.com',
  'blob:'
];

exports.getCsp = (nonce, walkmeEnabled, ibmCommonEnabled, isSessionPlayBackRequired, solisEnabled) => {
  if (isSessionPlayBackRequired) {
    return `script-src 'self'  'nonce-${nonce}' ${allowedScriptOriginsWalkMePlayBack.join(' ')}`;
  } else if (solisEnabled) {
    return `script-src 'self' 'nonce-${nonce}' ${allowedScriptOriginsIbmCommon.join(
      ' '
    )} 'http://localhost:3015' 'blob:http://localhost:3015'; img-src * data:; connect-src *`; //For local testing only
  } else if (walkmeEnabled) {
    return `script-src 'self' 'nonce-${nonce}' ${allowedScriptOriginsWalkMe.join(' ')}`;
  } else if (ibmCommonEnabled) {
    return `script-src 'self' 'nonce-${nonce}' ${allowedScriptOriginsIbmCommon.join(' ')}`;
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
