/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/golangRuntimePlatform/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/golangRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/golangRuntimePlatform/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.golangRuntimePlatform,

  kpiDefinitions,
  agentMonitoringIssueDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: t('in-forge:plugins.golangRuntimePlatform.go')
  }
});
