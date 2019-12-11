import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/azureSqlDatabase/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './Icons/SqlDbIconPath';

registerSnapshotDefinition({
  plugin: plugins.azureSqlDatabase,
  pluginName: {
    singular: 'Azure SQL Database',
    plural: 'Azure SQL Databases'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
