/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import agentMonitoringIssueDefinitions from 'in-forge/plugins/clrRuntimePlatform/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/clrRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/clrRuntimePlatform/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.clrRuntimePlatform,

  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.clrRuntimePlatform.indexLabel')
  }
});
