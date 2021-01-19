/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/azureStorage/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azureStorage/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.azureStorage,
  pluginName: {
    singular: 'Azure Storage Service',
    plural: 'Azure Storage Services'
  },
  kpiDefinitions,
  metricDefinitions
});
