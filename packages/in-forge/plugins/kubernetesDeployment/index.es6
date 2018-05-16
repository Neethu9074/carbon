import iconSvgPath from 'in-forge/plugins/kubernetesCluster/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.kubernetesDeployment,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Kubernetes Deployment',
    plural: 'Kubernetes Deployments'
  }
});
