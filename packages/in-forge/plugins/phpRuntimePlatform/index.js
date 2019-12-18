import kpiDefinitions from 'in-forge/plugins/phpRuntimePlatform/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/phpRuntimePlatform/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.phpRuntimePlatform,
  pluginName: {
    singular: 'PHP Runtime',
    plural: 'PHP Runtimes'
  },
  iconSvgPath,
  kpiDefinitions,
  technologyDescriptor: {
    label: 'PHP'
  }
});
