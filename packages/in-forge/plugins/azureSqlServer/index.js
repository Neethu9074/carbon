import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/azureSqlServer/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './Icons/SqlServerIconPath';

registerSnapshotDefinition({
  plugin: plugins.azureSqlServer,
  pluginName: {
    singular: 'Azure SQL Server',
    plural: 'Azure SQL Servers'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
