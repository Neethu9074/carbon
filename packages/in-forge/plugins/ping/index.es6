import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from './iconPath';

import metricDefinitions from './metricDefinitions';
import tableDefinition from './tableDefinition';

registerSnapshotDefinition({
  plugin: plugins.ping,
  metricDefinitions,
  tableDefinition,
  iconSvgPath,

  pluginName: {
    singular: 'Ping',
    plural: 'Ping'
  }
});
