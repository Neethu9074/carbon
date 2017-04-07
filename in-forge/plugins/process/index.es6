import tableDefinition from 'in-forge/plugins/process/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.process,
  iconSvgPath,
  metricDefinitions,
  tableDefinition,
  pluginName: {
    singular: 'Process',
    plural: 'Processes'
  }
});
