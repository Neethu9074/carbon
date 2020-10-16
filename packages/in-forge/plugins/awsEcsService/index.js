import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsEcsService,
  pluginName: {
    singular: 'AWS ECS Service',
    plural: 'AWS ECS Services'
  }
});
