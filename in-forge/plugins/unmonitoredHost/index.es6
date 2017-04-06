import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.unmonitoredHost,
  metricDefinitions,
  iconSvgPath,
  pluginName: {
    singular: 'Unmonitored Host',
    plural: 'Unmonitored Hosts'
  },

  getPower() {
    return 1;
  }
});
