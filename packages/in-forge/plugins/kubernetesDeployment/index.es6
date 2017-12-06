import iconSvgPath from 'in-forge/plugins/kubernetesCluster/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesDeployment,
  iconSvgPath,
  pluginName: {
    singular: 'Kubernetes Deployment',
    plural: 'Kubernetes Deployments'
  }
});
