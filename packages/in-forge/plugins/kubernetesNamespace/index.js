import metricDefinitions from 'in-forge/plugins/kubernetesNamespace/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kubernetesNamespace/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/kubernetesNamespace/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesNamespace,
  pluginName: {
    singular: 'Kubernetes Namespace',
    plural: 'Kubernetes Namespaces'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
