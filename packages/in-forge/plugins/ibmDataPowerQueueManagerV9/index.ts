/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import metricDefinitions from 'in-forge/plugins/ibmDataPowerQueueManagerV9/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmDataPowerQueueManagerV9/kpiDefinitions';
//@ts-expect-error
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmDataPowerQueueManagerV9,

  kpiDefinitions,
  metricDefinitions,
  getIconType: () => 'ibmDataPowerQueueManager'
});
