import metricDefinitions from 'in-forge/plugins/azureSqlServer/metricDefinitions';
import iconSvgPath from 'in-forge/plugins/azureSqlServer/Icons/SqlServerIconPath';
import kpiDefinitions from 'in-forge/plugins/azureSqlServer/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

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
