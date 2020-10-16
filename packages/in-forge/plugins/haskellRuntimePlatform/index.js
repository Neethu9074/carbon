import metricDefinitions from 'in-forge/plugins/haskellRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/haskellRuntimePlatform/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.haskellRuntimePlatform,
  pluginName: {
    singular: 'Haskell Application',
    plural: 'Haskell Applications'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Haskell'
  }
});
