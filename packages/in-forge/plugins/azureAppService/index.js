/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/azureAppService/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azureAppService/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.azureAppService,

  kpiDefinitions,
  metricDefinitions
});
