/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import metricDefinitions from 'in-forge/plugins/phmcLPAR/metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
registerSnapshotDefinition({
  plugin: plugins.phmcLPAR,

  metricDefinitions,
  getIconType: () => 'phmc_console'
});
