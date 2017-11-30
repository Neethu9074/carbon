import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.genericHardware,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Generic Hardware',
    plural: 'Generic Hardware'
  }
});
