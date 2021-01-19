/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/msSqlDatabase/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/msSqlDatabase/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.msSqlDatabase,
  pluginName: {
    singular: 'MS SQL Instance',
    plural: 'MS SQL Instances'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'MS SQL'
  }
});
