/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import kpiDefinitions from 'in-forge/plugins/oracleDB/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.oracleDB,
  pluginName: {
    singular: 'OracleDB',
    plural: 'OracleDBs'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'OracleDB'
  }
});
