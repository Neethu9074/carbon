/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import metricDefinitions from 'in-forge/plugins/tibcoBWAppInst/metricDefinitions';
// @ts-expect-error
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import kpiDefinitions from 'in-forge/plugins/tibcoBWAppInst/kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.tibcoBWAppInst,
  kpiDefinitions,
  metricDefinitions
});
