/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/haskellRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/haskellRuntimePlatform/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.haskellRuntimePlatform,

  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Haskell'
  }
});
