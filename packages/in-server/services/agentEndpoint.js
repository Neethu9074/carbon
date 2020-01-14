const serverConfig = require('../serverConfig.js');

exports.resolveAgentEndpoint = (tenant, unit) => {
  const clientConfig = serverConfig.clientConfig;

  // can be used for onprem and fullstack environments, GC and maybe others in the future
  if (clientConfig.agentEndpoint) {
    return clientConfig.agentEndpoint.replace('$TENANT', tenant).replace('$UNIT', unit);
  }
  // saas
  if (clientConfig.region) {
    return `saas-${clientConfig.region}.instana.io`;
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
