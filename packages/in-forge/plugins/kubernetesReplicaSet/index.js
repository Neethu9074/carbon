import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/kubernetesReplicaSet/kpiDefinitions';

registerSnapshotDefinition({
  plugin: plugins.kubernetesReplicaSet,
  pluginName: {
    singular: 'Kubernetes Replica Set',
    plural: 'Kubernetes Replica Sets'
  },
  kpiDefinitions
});
