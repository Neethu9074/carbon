import metricDefinitions from 'in-forge/plugins/crystalRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/crystalRuntimePlatform/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/crystalRuntimePlatform/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.crystalRuntimePlatform,
  pluginName: {
    singular: 'Crystal App',
    plural: 'Crystal Apps'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Crystal'
  }
});
