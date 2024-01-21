/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error Module needs to be translated to TS
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/azureServiceBusQueues/metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.azureServiceBusQueues,

  metricDefinitions
});
