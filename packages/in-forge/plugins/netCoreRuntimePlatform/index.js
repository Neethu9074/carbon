/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/netCoreRuntimePlatform/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/netCoreRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/netCoreRuntimePlatform/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.netCoreRuntimePlatform,

  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.netCoreRuntimePlatform.netCore')
  }
});
