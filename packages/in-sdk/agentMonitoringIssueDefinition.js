import React from 'react';

import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';

export const SENSOR = {
  suffix: 'not monitored',
  alert_prefix: 'Monitoring issue'
};
export const TRACER = {
  suffix: 'not traced',
  alert_prefix: 'Missing tracing'
};
export const PROFILER = {
  suffix: 'not profiled',
  alert_prefix: 'Missing profiles'
};
export const UNKNOWN = {
  suffix: 'not monitored',
  alert_prefix: 'Monitoring issue'
};

function fallbackAgentMonitoringIssueDefinition(code) {
  return {
    issueDescription: {
      Component: function fallbackIssueDefinition() {
        return (
          <span>
            Unknown issue code: <code>{code}</code>, please consult our documentation for further reference
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/`
  };
}

export default function getIssueDefinitionForSnapshotAndCode(snapshotOrPlugin, code) {
  // snapshotOrPlugin might be undefined / null, make sure to properly check.
  const plugin =
    snapshotOrPlugin && typeof snapshotOrPlugin === 'object' ? snapshotOrPlugin.get('plugin') : snapshotOrPlugin;
  const snapshotDefinition = plugin ? getOptionalSnapshotDefinition(plugin) : null;

  if (
    snapshotDefinition &&
    snapshotDefinition.agentMonitoringIssueDefinitions &&
    snapshotDefinition.agentMonitoringIssueDefinitions[code]
  ) {
    return snapshotDefinition.agentMonitoringIssueDefinitions[code];
  } else {
    return fallbackAgentMonitoringIssueDefinition(code);
  }
}
