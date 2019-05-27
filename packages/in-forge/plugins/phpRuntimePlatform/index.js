import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.phpRuntimePlatform,
  iconSvgPath,
  pluginName: {
    singular: 'PHP Runtime',
    plural: 'PHP Runtimes'
  },
  technologyDescriptor: {
    label: 'PHP'
  }
});
