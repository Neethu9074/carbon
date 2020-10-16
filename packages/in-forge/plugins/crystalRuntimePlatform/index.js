import metricDefinitions from 'in-forge/plugins/crystalRuntimePlatform/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/crystalRuntimePlatform/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.crystalRuntimePlatform,
  pluginName: {
    singular: 'Crystal App',
    plural: 'Crystal Apps'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Crystal'
  }
});
