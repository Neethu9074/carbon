import metricDefinitions from 'in-forge/plugins/kubernetesDaemonSet/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kubernetesDaemonSet/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/kubernetesDaemonSet/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesDaemonSet,
  pluginName: {
    singular: 'Kubernetes DaemonSet',
    plural: 'Kubernetes DaemonSets'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
