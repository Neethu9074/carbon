/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import kpiDefinitions from 'in-forge/plugins/pCFOrganization/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.pCFOrganization,
  pluginName: {
    singular: 'Cloud Foundry Organization',
    plural: 'Cloud Foundry Organizations'
  },
  kpiDefinitions
});
