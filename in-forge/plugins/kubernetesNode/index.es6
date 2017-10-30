import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import iconSvgPath from 'in-forge/plugins/kubernetesCluster/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.kubernetesNode,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Kubernetes Node',
    plural: 'Kubernetes Nodes'
  }
});
