import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.genericZone,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Custom Zone',
    plural: 'Custom Zones'
  }
});
