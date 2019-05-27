import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.kubernetesCluster,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Kubernetes Cluster',
    plural: 'Kubernetes Clusters'
  }
});
