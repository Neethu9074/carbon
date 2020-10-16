import kpiDefinitions from 'in-forge/plugins/kubernetesService/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kubernetesService,
  pluginName: {
    singular: 'Kubernetes Service',
    plural: 'Kubernetes Services'
  },
  kpiDefinitions
});
