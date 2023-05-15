/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import metricDefinitions from 'in-forge/plugins/phmcVIOS/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/phmcVIOS/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
registerSnapshotDefinition({
  plugin: plugins.phmcVIOS,

  kpiDefinitions,
  metricDefinitions,
  getIconType: () => 'phmc_console'
});
