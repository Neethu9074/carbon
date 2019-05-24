import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.kubernetesDeployment,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Kubernetes Deployment',
    plural: 'Kubernetes Deployments'
  }
});
