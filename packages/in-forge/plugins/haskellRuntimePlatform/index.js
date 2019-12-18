import metricDefinitions from 'in-forge/plugins/haskellRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/haskellRuntimePlatform/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/haskellRuntimePlatform/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.haskellRuntimePlatform,
  pluginName: {
    singular: 'Haskell Application',
    plural: 'Haskell Applications'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Haskell'
  }
});
