/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/instanaAgent/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/instanaAgent/metricDefinitions';
import tableDefinition from 'in-forge/plugins/instanaAgent/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/instanaAgent/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.instanaAgent,

  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions,
  tableDefinition
});
