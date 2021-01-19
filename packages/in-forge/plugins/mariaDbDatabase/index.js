/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/mariaDbDatabase/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/mariaDbDatabase/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.mariaDbDatabase,
  pluginName: {
    singular: 'MariaDB',
    plural: 'MariaDBs'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'MariaDB'
  }
});
