import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/nats/kpiDefinitions';

import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.nats,
  iconSvgPath,
  kpiDefinitions,
  pluginName: {
    singular: 'NATS',
    plural: 'NATS'
  },
  technologyDescriptor: {
    label: 'NATS'
  }
});
