/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/mySqlDatabase/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/mySqlDatabase/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.mySqlDatabase,
  pluginName: {
    singular: 'MySQL DB',
    plural: 'MySQL DBs'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'MySQL'
  }
});
