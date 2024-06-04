/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error Module needs to be translated to TS
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/awsAutoScaling/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsAutoScaling/kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsAutoScaling,
  kpiDefinitions,
  metricDefinitions
});
