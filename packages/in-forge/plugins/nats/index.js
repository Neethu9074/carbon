import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.nats,
  iconSvgPath,
  pluginName: {
    singular: 'NATS',
    plural: 'NATS'
  },
  technologyDescriptor: {
    label: 'NATS'
  }
});
