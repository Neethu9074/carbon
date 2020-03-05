const { get } = require('lodash');

const serverConfig = require('../serverConfig.js');

const allowedScriptOrigins = ['*.instana.io'];

if (isRequiringInstanaRocksWhitelisting()) {
  allowedScriptOrigins.push('*.instana.rocks');
}

if (serverConfig.mixpanelToken) {
  allowedScriptOrigins.push('https://cdn.mxpnl.com');
}

if (serverConfig.appcuesId) {
  allowedScriptOrigins.push('https://fast.appcues.com');
}

if (serverConfig.zendeskKey) {
  allowedScriptOrigins.push(
    'https://static.zdassets.com',
    'https://ekr.zdassets.com',
    'https://instana.zendesk.com',
    'wss://instana.zendesk.com'
  );
}

exports.getCsp = nonces => {
  const stringifiedNonces = nonces.map(n => `'nonce-${n}'`).join(' ');
  const stringifiedOrigins = allowedScriptOrigins.join(' ');
  return `script-src 'self' ${stringifiedNonces} ${stringifiedOrigins}`;
};

exports.findMaxNonces = template => {
  const nonceMatches = template.match(/nonces\.\[\d+\]/gi);
  if (nonceMatches) {
    const nonceIndices = nonceMatches.map(match => parseInt(/nonces\.\[(\d+)\]/i.exec(match)[1]));
    return Math.max(...nonceIndices) + 1;
  }
  return 0;
};

function isRequiringInstanaRocksWhitelisting() {
  return (
    isInstanaRocks(get(serverConfig, ['eum', 'domain'])) ||
    isInstanaRocks(get(serverConfig, ['eum', 'retrievalDomain']))
  );
}

function isInstanaRocks(s) {
  return (s || '').indexOf('.instana.rocks') !== -1;
}
