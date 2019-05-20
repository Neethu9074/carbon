import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import tableDefinition from './tableDefinition';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.instanaAgent,

  tableDefinition,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Instana Agent',
    plural: 'Instana Agents'
  }
});
