import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.f5,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'F5',
    plural: 'F5'
  }
});
