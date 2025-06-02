/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error needs TS migration
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/linuxKVMHypervisorHost/metricDefinitions';
import { plugins } from 'in-forge/constants';

const linuxPlugin = plugins.host + '_linux';

registerSnapshotDefinition({
  plugin: plugins.linuxKVMHypervisorHost,
  metricDefinitions,
  getIconType: () => linuxPlugin
});
