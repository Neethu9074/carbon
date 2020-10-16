import kpiDefinitions from 'in-forge/plugins/phpRuntimePlatform/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.phpRuntimePlatform,
  pluginName: {
    singular: 'PHP Runtime',
    plural: 'PHP Runtimes'
  },
  kpiDefinitions,
  technologyDescriptor: {
    label: 'PHP'
  }
});
