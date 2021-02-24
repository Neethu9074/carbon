/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/googleCloudPubSubTopic/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/googleCloudPubSubTopic/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.googleCloudPubSubTopic,

  kpiDefinitions,
  metricDefinitions
});
