import metricDefinitions from 'in-forge/plugins/netCoreRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/netCoreRuntimePlatform/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/netCoreRuntimePlatform/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.netCoreRuntimePlatform,
  pluginName: {
    singular: '.NET Core App',
    plural: '.NET Core Apps'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: '.NET Core'
  }
});
