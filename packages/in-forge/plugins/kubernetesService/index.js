import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/kubernetesService/kpiDefinitions';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.kubernetesService,
  iconSvgPath,
  kpiDefinitions,
  pluginName: {
    singular: 'Kubernetes Service',
    plural: 'Kubernetes Services'
  }
});
