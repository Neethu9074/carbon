import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from './metricDefinitions';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/kubernetesNode/kpiDefinitions';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.kubernetesNode,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'Kubernetes Node',
    plural: 'Kubernetes Nodes'
  }
});
