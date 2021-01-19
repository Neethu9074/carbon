/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import agentMonitoringIssueDefinitions from 'in-forge/plugins/nginx/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/nginx/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/nginx/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.nginx,
  pluginName: {
    singular: 'Nginx Server',
    plural: 'Nginx Servers'
  },
  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  technologyDescriptor: {
    label: 'Nginx'
  }
});
