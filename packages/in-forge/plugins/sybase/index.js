/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/sybase/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/sybase/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.sybase,

  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Sybase'
  }
});
