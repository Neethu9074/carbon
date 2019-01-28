import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.packet,
  pluginName: {
    singular: 'Packet Instance',
    plural: 'Packet Instances'
  },
  iconSvgPath,
  metricDefinitions
});
