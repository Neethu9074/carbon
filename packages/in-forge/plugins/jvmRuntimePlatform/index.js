/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import agentMonitoringIssueDefinitions from 'in-forge/plugins/jvmRuntimePlatform/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/jvmRuntimePlatform/metricDefinitions';
import tableDefinition from 'in-forge/plugins/jvmRuntimePlatform/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/jvmRuntimePlatform/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import 'in-forge/plugins/jvmRuntimePlatform/metrics';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.jvmRuntimePlatform,
  pluginName: {
    singular: 'JVM',
    plural: 'JVMs'
  },
  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  tableDefinition,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: 'JVM'
  }
});
