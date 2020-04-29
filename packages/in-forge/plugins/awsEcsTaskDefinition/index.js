import iconSvgPath from 'in-forge/plugins/awsEcsTaskDefinition/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsEcsTaskDefinition,
  pluginName: {
    singular: 'AWS ECS Task Definition',
    plural: 'AWS ECS Task Definitions'
  },
  iconSvgPath
});
