/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/googleCloudPubSub/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/googleCloudPubSub/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.googleCloudPubSub,

  technologyDescriptor: {
    label: 'Google Cloud PubSub'
  },
  kpiDefinitions,
  metricDefinitions
});
