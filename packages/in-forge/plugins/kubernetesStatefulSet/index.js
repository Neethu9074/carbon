import iconSvgPath from 'in-forge/plugins/kubernetesStatefulSet/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesStatefulSet,
  pluginName: {
    singular: 'Kubernetes Stateful Set',
    plural: 'Kubernetes Stateful Sets'
  },
  iconSvgPath
});
