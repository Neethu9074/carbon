/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import agentMonitoringIssueDefinitions from 'in-forge/plugins/postgreSqlDatabase/agentMonitoringIssueDefinitions.js';
import metricDefinitions from 'in-forge/plugins/postgreSqlDatabase/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/postgreSqlDatabase/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.postgreSqlDatabase,
  pluginName: {
    singular: 'PostgreSQL DB',
    plural: 'PostgreSQL DBs'
  },
  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  technologyDescriptor: {
    label: 'PostgreSQL'
  }
});
