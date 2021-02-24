/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/golangRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/golangRuntimePlatform/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.golangRuntimePlatform,

  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Go'
  }
});
