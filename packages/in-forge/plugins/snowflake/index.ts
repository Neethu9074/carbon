/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import agentMonitoringIssueDefinitions from 'in-forge/plugins/snowflake/agentMonitoringIssueDefinitions';
//@ts-expect-error
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/snowflake/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/snowflake/kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.snowflake,
  kpiDefinitions,
  metricDefinitions,
  agentMonitoringIssueDefinitions
});
