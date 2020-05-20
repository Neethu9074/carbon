import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/redis/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.redisEnterpriseDatabase,
  pluginName: {
    singular: 'Redis Enterprise Database',
    plural: 'Redis Enterprise Databases'
  },
  iconSvgPath,
  technologyDescriptor: {
    label: 'Redis Enterprise'
  }
});
