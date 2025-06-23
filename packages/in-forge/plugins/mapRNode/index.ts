/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/mapRNode/agentMonitoringIssueDefinitions';
//@ts-expect-error
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/mapRNode/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/mapRNode/kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.mapRNode,
  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions
});
