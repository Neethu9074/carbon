/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import metricDefinitions from 'in-forge/plugins/ibmMqMftTransfer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmMqMftTransfer/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmMqMftTransfer,
  kpiDefinitions,
  metricDefinitions
});
