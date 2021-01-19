/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import kpiDefinitions from 'in-forge/plugins/pCFSpace/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pCFSpace,
  pluginName: {
    singular: 'Cloud Foundry Space',
    plural: 'Cloud Foundry Spaces'
  },
  kpiDefinitions
});
