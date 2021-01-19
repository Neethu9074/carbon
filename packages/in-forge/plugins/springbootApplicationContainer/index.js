/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import agentMonitoringIssueDefinitions from 'in-forge/plugins/springbootApplicationContainer/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/springbootApplicationContainer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/springbootApplicationContainer/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.springbootApplicationContainer,
  pluginName: {
    singular: 'Spring Boot App',
    plural: 'Spring Boot Apps'
  },
  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  getCodeView,
  supportsCodeView,
  technologyDescriptor: {
    label: 'Spring Boot'
  }
});
