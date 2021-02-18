/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import { t } from 'in-i18n';

export const SENSOR = {
  suffix: t('in-sdk:agentMonitoringSuffix01'),
  alert_prefix: t('in-sdk:agentMonitoringAlert_prefix01')
};
export const TRACER = {
  suffix: t('in-sdk:agentMonitoringSuffix02'),
  alert_prefix: t('in-sdk:agentMonitoringAlert_prefix02')
};
export const PROFILER = {
  suffix: t('in-sdk:agentMonitoringSuffix03'),
  alert_prefix: t('in-sdk:agentMonitoringAlert_prefix03')
};
export const UNKNOWN = {
  suffix: t('in-sdk:agentMonitoringSuffix04'),
  alert_prefix: t('in-sdk:agentMonitoringAlert_prefix04')
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
    explanationLinkLabel: t('in-sdk:agentMonitoringExplanationLinkLabel'),
    explanationLinkHref: t('in-sdk:agentMonitoringExplanationLinkHref')
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
