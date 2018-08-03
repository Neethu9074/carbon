import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.netCoreRuntimePlatform,
  iconSvgPath,
  metricDefinitions,
  pluginName: {
    singular: '.NET Core App',
    plural: '.NET Core Apps'
  },
  technologyDescriptor: {
    label: '.NET Core'
  }
});
