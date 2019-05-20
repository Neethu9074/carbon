import iconSvgPath from 'in-forge/plugins/kubernetesCluster/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesNode,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Kubernetes Node',
    plural: 'Kubernetes Nodes'
  }
});
