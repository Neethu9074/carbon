const serverConfig = require('../serverConfig.js');

exports.resolveAgentEndpoint = (tenant, unit) => {
  const clientConfig = serverConfig.clientConfig;

  // can be used for onprem and fullstack environments, GC and maybe others in the future
  if (clientConfig.agentEndpoint) {
    return clientConfig.agentEndpoint.replace('$TENANT', tenant).replace('$UNIT', unit);
  }

  // saas
  if (clientConfig.region) {
    if (clientConfig.region === 'eu-west-1') {
      return 'ingress-blue-saas.instana.io';
    } else if (clientConfig.region === 'us-west-2') {
      return 'ingress-red-saas.instana.io';
    }
    return `ingress-${clientConfig.region}-saas.instana.io'`;
  }
};

exports.resolveAgentEndpointPort = () => {
  const clientConfig = serverConfig.clientConfig;

  // can be configured, e.g. for onprem
  if (clientConfig.agentEndpointPort) {
    return clientConfig.agentEndpointPort;
  }
  return '443';
};
