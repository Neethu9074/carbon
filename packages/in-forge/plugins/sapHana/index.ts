/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/sapHana/agentMonitoringIssueDefinitions';
// @ts-expect-error needs TS migration
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/sapHana/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/sapHana/kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.sapHana,

  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions
});
