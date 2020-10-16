import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsEcsTask,
  pluginName: {
    singular: 'AWS ECS Task',
    plural: 'AWS ECS Tasks'
  }
});
