import kpiDefinitions from 'in-forge/plugins/phpRuntimePlatform';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.phpRuntimePlatform,
  iconSvgPath,
  kpiDefinitions,
  pluginName: {
    singular: 'PHP Runtime',
    plural: 'PHP Runtimes'
  },
  technologyDescriptor: {
    label: 'PHP'
  }
});
