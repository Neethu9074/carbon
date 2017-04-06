import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.redis,
  iconSvgPath,
  pluginName: {
    singular: 'Redis Node',
    plural: 'Redis Nodes'
  }
});
