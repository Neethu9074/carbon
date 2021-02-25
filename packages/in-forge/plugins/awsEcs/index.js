/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

// There is no infrastructure entity AWS ECS. But there is a technology AWS ECS. Currently, providing a dummy plug-in
// (with a technologyDescriptor attribute) in the ui-client' in-forge/plugins folder is the only way to tell the UI to
// provide an "AWS ECS" technology filter option in unbounded analytics. Also, the unbounded analytics page breaks if
// you fail to do so (Error: "Unknown snapshot type: awsEcs" in
// packages/in-sdk/snapshot/registry.js#getSnapshotDefinition when clicking on Technologies).
registerSnapshotDefinition({
  plugin: plugins.awsEcs,

  technologyDescriptor: {
    label: 'AWS ECS'
  }
});
