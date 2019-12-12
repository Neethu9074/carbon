import kpiDefinitions from 'in-forge/plugins/kubernetesService/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/kubernetesService/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesService,
  pluginName: {
    singular: 'Kubernetes Service',
    plural: 'Kubernetes Services'
  },
  iconSvgPath,
  kpiDefinitions
});
