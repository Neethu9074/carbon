exports.getCsp = nonces => {
  return (
    "script-src 'self' " +
    nonces.map(n => "'nonce-" + n + "'").join(' ') +
    ' https://cdn.mxpnl.com https://static.zdassets.com https://ekr.zdassets.com https://instana.zendesk.com wss://instana.zendesk.com https://fast.appcues.com *.instana.io'
  );
};

exports.findMaxNonces = template => {
  const nonceMatches = template.match(/nonces\.\[\d+\]/gi);
  if (nonceMatches) {
    const nonceIndices = nonceMatches.map(match => parseInt(/nonces\.\[(\d+)\]/i.exec(match)[1]));
    return Math.max(...nonceIndices) + 1;
  }
  return 0;
};
