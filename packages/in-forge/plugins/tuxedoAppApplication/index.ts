/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import metricDefinitions from 'in-forge/plugins/tuxedoAppApplication/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/tuxedoAppApplication/kpiDefinitions';
// @ts-expect-error
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.tuxedoAppApplication,
  kpiDefinitions,
  metricDefinitions
});
