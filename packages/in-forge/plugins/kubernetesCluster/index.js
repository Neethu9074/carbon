import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.kubernetesCluster,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Kubernetes Cluster',
    plural: 'Kubernetes Clusters'
  }
});
