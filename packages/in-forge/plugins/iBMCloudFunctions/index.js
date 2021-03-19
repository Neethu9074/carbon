/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/iBMCloudFunctions/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/iBMCloudFunctions/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.iBMCloudFunctions,

  technologyDescriptor: {
    label: 'IBM Cloud Functions'
  },
  kpiDefinitions,
  metricDefinitions,

});
