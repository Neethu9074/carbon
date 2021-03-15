/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/azureCosmosDb/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azureCosmosDb/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.azureCosmosDb,

  kpiDefinitions,
  metricDefinitions
});
