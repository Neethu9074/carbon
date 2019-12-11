import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import kpiDefinitions from 'in-forge/plugins/ping';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import tableDefinition from './tableDefinition';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.ping,
  kpiDefinitions,
  metricDefinitions,
  tableDefinition,
  iconSvgPath,
  pluginName: {
    singular: 'Ping',
    plural: 'Ping'
  }
});
