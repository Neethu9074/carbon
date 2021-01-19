/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import kpiDefinitions from 'in-forge/plugins/kubernetesReplicaSet/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesReplicaSet,
  pluginName: {
    singular: 'Kubernetes Replica Set',
    plural: 'Kubernetes Replica Sets'
  },
  kpiDefinitions
});
