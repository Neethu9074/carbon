import React from 'react';

import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';

function fallbackAgentMonitoringIssueDefinition(code) {
  return {
    issueDescription: {
      Component: function fallbackIssueDefinition() {
        return (
          <span>
            Unknown issue code: <code>{code}</code>. Please consult our documentation for further reference.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/`
  };
}

export function getIssueDefinitionForSnapshotAndCode(snapshotOrPlugin, code) {
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
