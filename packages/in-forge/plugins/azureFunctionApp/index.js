/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import metricDefinitions from 'in-forge/plugins/azureFunctionApp/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azureFunctionApp/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.azureFunctionApp,

  kpiDefinitions,
  metricDefinitions
});