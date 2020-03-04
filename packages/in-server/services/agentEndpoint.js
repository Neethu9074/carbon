const sendRequest = require('request');

const serverConfig = require('../serverConfig.js');

exports.getReportingEndpointsFromButler = (butlerUrl, tenant, unit) => {
  return new Promise(resolve => {
    sendRequest(
      {
        url: butlerUrl,
        timeout: 15000
      },
      (error, response, reportingConfig) => {
        if (error || response.status < 200 || response.status >= 300) {
          console.error(
            `Could not load reporting config from butler. error:${error}, response: ${response}, reportingConfig: ${reportingConfig}`
          );
          resolve(getFallbackReportingConfig(tenant, unit));
        } else {
          const parsedReportingConfig = getReportingConfigFromString(reportingConfig);
          if (!parsedReportingConfig) {
            console.error('Failed parsing reporting config. Fall back to default.');
            resolve(getFallbackReportingConfig(tenant, unit));
          } else {
            resolve({
              agentEndpoint: parsedReportingConfig.acceptorHost,
              port: parsedReportingConfig.acceptorPort,
              websiteScriptSource: parsedReportingConfig.websiteMonitoringScriptSource,
              websiteEndpoint: parsedReportingConfig.websiteMonitoringReporting,
              mobileEndpoint: parsedReportingConfig.mobileMonitoringReporting,
              serverlessEndpoint: parsedReportingConfig.serverlessAcceptor
            });
          }
        }
      }
    );
  });
};

exports.resolveAgentEndpoint = resolveAgentEndpoint;
exports.resolveAgentEndpointPort = resolveAgentEndpointPort;

function resolveAgentEndpoint(tenant, unit) {
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
}

function resolveAgentEndpointPort() {
  const clientConfig = serverConfig.clientConfig;

  // can be configured, e.g. for onprem
  if (clientConfig.agentEndpointPort) {
    return clientConfig.agentEndpointPort;
  }
  return '443';
}

function getFallbackReportingConfig(tenant, unit) {
  const fallbackConfig = {
    agentEndpoint: resolveAgentEndpoint(tenant, unit),
    port: resolveAgentEndpointPort()
  };
  fallbackConfig.serverlessEndpoint = `${fallbackConfig.agentEndpoint}:${fallbackConfig.agentEndpointPort}`;
}

function getReportingConfigFromString(str) {
  let agentEndpointConfig;
  try {
    agentEndpointConfig = JSON.parse(str);
  } catch (error) {
    agentEndpointConfig = null;
  }
  return agentEndpointConfig;
}
