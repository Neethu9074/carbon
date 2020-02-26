const sendRequest = require('request');

const serverConfig = require('../serverConfig.js');

const resolveAgentEndpoint = (tenant, unit) => {
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
    return `ingress-${clientConfig.region}-saas.instana.io`;
  }
};

const resolveAgentEndpointPort = () => {
  const clientConfig = serverConfig.clientConfig;

  // can be configured, e.g. for onprem
  if (clientConfig.agentEndpointPort) {
    return clientConfig.agentEndpointPort;
  }
  return '443';
};

exports.resolveAgentEndpoint = resolveAgentEndpoint;
exports.resolveAgentEndpointPort = resolveAgentEndpointPort;

exports.getAgentEndpointConfigurationFromUrl = (url, tenant, unit) => {
  console.log(`Get agent endpoint config from butler: ${url}`);
  return new Promise(resolve => {
    sendRequest(
      {
        url: url,
        timeout: 15000
      },
      (error, response, agentEndpointConfig) => {
        if (error || response.status < 200 || response.status >= 300) {
          console.error(
            `Could not load agent endpoint config from butler. error:${error}, response: ${response}, agentEndpointConfig: ${agentEndpointConfig}`
          );
          resolve({ agentEndpoint: resolveAgentEndpoint(tenant, unit), port: resolveAgentEndpointPort() });
        } else {
          const parsedAgentEndpointConfig = getAgentEndpointConfigurationFromString(agentEndpointConfig);
          console.log(`Received agent endpoint config from butler: ${agentEndpointConfig}`);
          if (!parsedAgentEndpointConfig) {
            console.error('Failed parsing agent endpoint config. Fall back to default.');
            resolve({ agentEndpoint: resolveAgentEndpoint(tenant, unit), port: resolveAgentEndpointPort() });
          } else {
            resolve({
              agentEndpoint: parsedAgentEndpointConfig.acceptorHost,
              port: parsedAgentEndpointConfig.acceptorPort
            });
          }
        }
      }
    );
  });
};

function getAgentEndpointConfigurationFromString(str) {
  let agentEndpointConfig;
  try {
    agentEndpointConfig = JSON.parse(str);
  } catch (error) {
    agentEndpointConfig = null;
  }
  return agentEndpointConfig;
}
