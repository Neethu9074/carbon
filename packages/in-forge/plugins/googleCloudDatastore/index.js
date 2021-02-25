/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/googleCloudDatastore/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/googleCloudDatastore/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.googleCloudDatastore,

  technologyDescriptor: {
    label: 'Google Cloud Datastore'
  },
  kpiDefinitions,
  metricDefinitions
});
