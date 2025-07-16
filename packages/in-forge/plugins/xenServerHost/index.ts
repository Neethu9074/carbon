/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error needs TS migration
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/xenServerHost/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/xenServerHost/kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.xenServerHost,
  kpiDefinitions,
  metricDefinitions,
  getIconType: () => 'xenserver'
});
