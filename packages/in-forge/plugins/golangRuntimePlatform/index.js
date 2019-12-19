import metricDefinitions from 'in-forge/plugins/golangRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/golangRuntimePlatform/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/golangRuntimePlatform/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.golangRuntimePlatform,
  pluginName: {
    singular: 'Go App',
    plural: 'Go Apps'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Go'
  }
});
