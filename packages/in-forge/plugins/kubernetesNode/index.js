import metricDefinitions from 'in-forge/plugins/kubernetesNode/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kubernetesNode/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/kubernetesNode/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesNode,
  pluginName: {
    singular: 'Kubernetes Node',
    plural: 'Kubernetes Nodes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
