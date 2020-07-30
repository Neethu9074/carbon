import metricDefinitions from 'in-forge/plugins/kubernetesStatefulSet/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kubernetesStatefulSet/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/kubernetesStatefulSet/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesStatefulSet,
  pluginName: {
    singular: 'Kubernetes StatefulSet',
    plural: 'Kubernetes StatefulSets'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
