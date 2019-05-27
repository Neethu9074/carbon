import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.kubernetesPod,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Kubernetes Pod',
    plural: 'Kubernetes Pods'
  }
});
