/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const serverConfig = require('../serverConfig.js');
const fetch = require('./fetch');

exports.getReportingEndpointsFromButler = async (req, butlerUrl, tenant, unit) => {
  try {
    const response = await fetch(`${butlerUrl}/tos-privacy-agreement/acceptors/?tenant=${tenant}&unit=${unit}`, {
      headers: {
        Cookie: `${serverConfig.cookie.name}=${req.cookies[serverConfig.cookie.name]}`
      },
      timeout: 15000
    });

    if (!response.ok) {
      console.error(`Could not load reporting config from butler. Got status: %s`, response.status);
      return getFallbackReportingConfig(tenant, unit);
    }

    const body = await response.text();
    const reportingConfig = getReportingConfigFromString(body);
    if (reportingConfig) {
      return {
        agentEndpoint: reportingConfig.acceptorHost,
        port: reportingConfig.acceptorPort,
        websiteScriptSource: reportingConfig.websiteMonitoringScriptSource,
        websiteEndpoint: reportingConfig.websiteMonitoringReporting,
        mobileEndpoint: reportingConfig.mobileMonitoringReporting,
        serverlessEndpoint: reportingConfig.serverlessAcceptor
      };
    }

    console.error('Failed reading reporting config. Fall back to default.');
    return getFallbackReportingConfig(tenant, unit);
  } catch (e) {
    console.error(`Could not load reporting config from butler. Got error`, e);
    return getFallbackReportingConfig(tenant, unit);
  }
};

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
  fallbackConfig.serverlessEndpoint = `${fallbackConfig.agentEndpoint}:${fallbackConfig.port}`;
  return fallbackConfig;
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
