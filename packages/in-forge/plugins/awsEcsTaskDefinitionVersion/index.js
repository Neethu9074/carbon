import iconSvgPath from 'in-forge/plugins/awsEcsTaskDefinitionVersion/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsEcsTaskDefinitionVersion,
  pluginName: {
    singular: 'AWS ECS Task Definition Version',
    plural: 'AWS ECS Task Definition Versions'
  },
  iconSvgPath
});
