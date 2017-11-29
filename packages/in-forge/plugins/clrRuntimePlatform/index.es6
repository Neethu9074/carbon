import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.clrRuntimePlatform,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: '.NET App',
    plural: '.NET Apps'
  }
});
