import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/netCoreRuntimePlatform/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.netCoreRuntimePlatform,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: '.NET Core App',
    plural: '.NET Core Apps'
  },
  technologyDescriptor: {
    label: '.NET Core'
  }
});
