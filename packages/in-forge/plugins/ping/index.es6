import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-sdk/unknownIconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.ping,
  metricDefinitions,
  iconSvgPath,

  pluginName: {
    singular: 'Ping',
    plural: 'Ping'
  }
});
