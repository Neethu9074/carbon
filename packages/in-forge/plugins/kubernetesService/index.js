import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.kubernetesService,
  iconSvgPath,
  pluginName: {
    singular: 'Kubernetes Service',
    plural: 'Kubernetes Services'
  }
});
