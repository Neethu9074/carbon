/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import metricDefinitions from 'in-forge/plugins/tibcoASDataGrid/metricDefinitions';
//@ts-expect-error
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import kpiDefinitions from 'in-forge/plugins/tibcoASDataGrid/kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.tibcoASDataGrid,
  kpiDefinitions,
  metricDefinitions
});
