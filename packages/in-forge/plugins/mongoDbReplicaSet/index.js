/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/mongoDbReplicaSet/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/mongoDbReplicaSet/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.mongoDbReplicaSet,
  pluginName: {
    singular: 'MongoDB Replica Set',
    plural: 'MongoDB Replica Sets'
  },
  kpiDefinitions,
  metricDefinitions
});
