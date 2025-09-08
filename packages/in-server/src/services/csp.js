/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const { get } = require('lodash');

const serverConfig = require('../serverConfig.js');

const allowedScriptOrigins = ['https://*.instana.io', 'https://*.instana.tools'];

if (isRequiringInstanaRocks()) {
  allowedScriptOrigins.push('https://*.instana.rocks');
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
  'https://ec.walkme.com',
  'blob:'
];

const allowedScriptOriginsWalkMePlayBack = [
  ...allowedScriptOriginsWalkMe,
  'https://playback-assets.walkme.com',
  'https://ec-playback.walkme.com',
  'blob:'
];

/**
 * Generates a Content Security Policy header string based on enabled features
 *
 * @param {string} nonce - Cryptographic nonce for authorizing inline scripts
 * @param {boolean} walkmeEnabled - Whether WalkMe user guidance platform is enabled
 * @param {boolean} ibmCommonEnabled - Whether IBM common scripts are enabled
 * @param {boolean} isSessionPlayBackRequired - Whether WalkMe session recording is needed
 * @param {boolean} solisEnabled - Whether development environment (Solis) is enabled
 * @param {boolean} isControlledEnvEnabled - Whether controlled environment restrictions apply
 * @returns {string} Formatted CSP header string
 */
exports.getCsp = (
  nonce,
  walkmeEnabled,
  ibmCommonEnabled,
  isSessionPlayBackRequired,
  solisEnabled,
  isControlledEnvEnabled
) => {
  // Base CSP directives that are common across all configurations
  const baseDirectives = {
    // Allows styles from same origin and inline styles
    // Security: 'unsafe-inline' weakens protection but is often needed for frameworks
    // Consider using nonces or hashes instead when possible
    'style-src': ["'self'", "'unsafe-inline'", 'https://www.ibm.com']
  };

  // Script sources based on configuration
  // Security: nonce provides strong protection for inline scripts
  const scriptSrc = ["'self'", `'nonce-${nonce}'`];

  // Add script sources based on configuration
  // Development environment configuration
  // Security: Adds localhost sources for development, should never be used in production
  if (solisEnabled && !isControlledEnvEnabled) {
    scriptSrc.push(...allowedScriptOriginsWalkMe, 'http://localhost:3015', 'blob:http://localhost:3015');
  }
  // Session playback configuration
  // Security: Requires additional domains for recording functionality
  else if (isSessionPlayBackRequired) {
    scriptSrc.push(...allowedScriptOriginsWalkMePlayBack);
  }
  // WalkMe guidance platform configuration
  // Security: Adds WalkMe domains for user guidance functionality
  else if (walkmeEnabled) {
    scriptSrc.push(...allowedScriptOriginsWalkMe);
  }
  // IBM Common scripts configuration
  // Security: Adds IBM domains for common functionality
  else if (ibmCommonEnabled) {
    scriptSrc.push(...allowedScriptOriginsIbmCommon);
  }
  // Base configuration with minimal permissions
  // Security: Most restrictive option with only essential domains
  else {
    scriptSrc.push(...allowedScriptOrigins);
  }

  // Combine all directives
  const directives = {
    ...baseDirectives,
    // Controls where scripts can be loaded from and executed
    // Security: Uses nonce for inline scripts and restricts external scripts to whitelisted domains
    'script-src': scriptSrc
  };

  // Convert directives object to CSP string
  // This creates the final CSP header value in the format: directive-name value1 value2; directive-name value1;
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
};

/**
 * Checks if any EUM domains in server config require .instana.rocks domains
 *
 * @returns {boolean} True if .instana.rocks domains should be included in CSP
 */
function isRequiringInstanaRocks() {
  return (
    isInstanaRocks(get(serverConfig, ['eum', 'domain'])) ||
    isInstanaRocks(get(serverConfig, ['eum', 'retrievalDomain']))
  );
}

/**
 * Checks if a string contains .instana.rocks domain
 *
 * @param {string} s - Domain string to check
 * @returns {boolean} True if string contains .instana.rocks
 */
function isInstanaRocks(s) {
  return (s || '').indexOf('.instana.rocks') !== -1;
}
