/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/tibcoASProxy/agentMonitoringIssueDefinitions';
import metricDefinitions from 'in-forge/plugins/tibcoASProxy/metricDefinitions';
//@ts-expect-error
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.tibcoASProxy,
  metricDefinitions,
  agentMonitoringIssueDefinitions
});
