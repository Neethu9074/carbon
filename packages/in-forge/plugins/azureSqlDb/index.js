/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/azureSqlDb/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azureSqlDb/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.azureSqlDb,

  kpiDefinitions,
  metricDefinitions
});
