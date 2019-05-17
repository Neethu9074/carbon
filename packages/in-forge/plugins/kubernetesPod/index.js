import iconSvgPath from 'in-forge/plugins/kubernetesCluster/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.kubernetesPod,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Kubernetes Pod',
    plural: 'Kubernetes Pods'
  }
});
