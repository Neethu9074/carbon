import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import tableDefinition from './tableDefinition';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.instanaAgent,

  isNewDashboard: __DEV__ ? true : false,

  tableDefinition,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Instana Agent',
    plural: 'Instana Agents'
  }
});
