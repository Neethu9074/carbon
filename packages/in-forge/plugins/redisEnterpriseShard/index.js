import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/redis/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.redisEnterpriseShard,
  pluginName: {
    singular: 'Redis Enterprise Shard',
    plural: 'Redis Enterprise Shards'
  },
  iconSvgPath,
  technologyDescriptor: {
    label: 'Redis Enterprise'
  }
});
