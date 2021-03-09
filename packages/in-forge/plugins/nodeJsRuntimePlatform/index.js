/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import agentMonitoringIssueDefinitions from 'in-forge/plugins/nodeJsRuntimePlatform/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/nodeJsRuntimePlatform/metricDefinitions';
import tableDefinition from 'in-forge/plugins/nodeJsRuntimePlatform/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/nodeJsRuntimePlatform/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { getCodeView } from 'in-forge/codeView/node';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

registerSnapshotDefinition({
  plugin: plugins.nodeJsRuntimePlatform,

  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  tableDefinition,
  getCodeView,
  technologyDescriptor: {
    label: t('in-forge:plugins.nodeJsRuntimePlatform.nodeJs')
  }
});
