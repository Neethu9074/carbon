/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsEcsContainer,
  pluginName: {
    singular: 'AWS ECS Container',
    plural: 'AWS ECS Containers'
  },
  supportsInfrastructureTabSubscript: true
});
