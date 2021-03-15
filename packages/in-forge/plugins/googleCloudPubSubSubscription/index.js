/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/googleCloudPubSubSubscription/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/googleCloudPubSubSubscription/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.googleCloudPubSubSubscription,

  kpiDefinitions,
  metricDefinitions
});
