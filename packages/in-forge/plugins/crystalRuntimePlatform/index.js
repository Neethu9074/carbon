import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.crystalRuntimePlatform,

  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: 'Crystal App',
    plural: 'Crystal Apps'
  },
  technologyDescriptor: {
    label: 'Crystal'
  }
});
