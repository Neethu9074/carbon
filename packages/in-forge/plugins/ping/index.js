import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import tableDefinition from './tableDefinition';
import iconSvgPath from './iconPath';

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
