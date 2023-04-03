/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/tuxedoServer/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/tuxedoServer/kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.tuxedoServer,
  kpiDefinitions,
  metricDefinitions
});
