import iconSvgPath from 'in-forge/plugins/kubernetesCluster/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.kubernetesNamespace,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Kubernetes Namespace',
    plural: 'Kubernetes Namespaces'
  }
});
