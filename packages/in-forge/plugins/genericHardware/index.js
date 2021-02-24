/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/genericHardware/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/genericHardware/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.genericHardware,

  kpiDefinitions,
  metricDefinitions
});
