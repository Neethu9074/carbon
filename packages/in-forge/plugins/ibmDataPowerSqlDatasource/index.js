/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/ibmDataPowerSqlDatasource/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/ibmDataPowerSqlDatasource/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.ibmDataPowerSqlDatasource,

  kpiDefinitions,
  metricDefinitions
});
