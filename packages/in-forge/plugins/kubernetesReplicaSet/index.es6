import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesReplicaSet,
  pluginName: {
    singular: 'Kubernetes Replica Set',
    plural: 'Kubernetes Replica Sets'
  }
});
