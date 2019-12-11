import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import kpiDefinitions from 'in-forge/plugins/packet';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.packet,
  iconSvgPath,
  metricDefinitions,
  kpiDefinitions,
  pluginName: {
    singular: 'Packet Instance',
    plural: 'Packet Instances'
  }
});
