/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import kpiDefinitions from 'in-forge/plugins/aerospike/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.aerospike,
  pluginName: {
    singular: 'Aerospike',
    plural: 'Aerospike'
  },
  kpiDefinitions,
  technologyDescriptor: {
    label: 'Aerospike'
  }
});
