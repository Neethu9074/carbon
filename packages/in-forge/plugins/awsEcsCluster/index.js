import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsEcsCluster,
  pluginName: {
    singular: 'AWS ECS Cluster',
    plural: 'AWS ECS Clusters'
  }
});
