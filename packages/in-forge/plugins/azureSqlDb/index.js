import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/azureSqlDb/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './Icons/SqlDbIconPath';

registerSnapshotDefinition({
  plugin: plugins.azureSqlDb,
  pluginName: {
    singular: 'Azure SQL Database',
    plural: 'Azure SQL Databases'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
