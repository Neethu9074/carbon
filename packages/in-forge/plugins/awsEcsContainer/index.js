import iconSvgPath from 'in-forge/plugins/awsEcsContainer/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsEcsContainer,
  pluginName: {
    singular: 'AWS ECS Container',
    plural: 'AWS ECS Containers'
  },
  iconSvgPath,
  supportsInfrastructureTabSubscript: true
});
