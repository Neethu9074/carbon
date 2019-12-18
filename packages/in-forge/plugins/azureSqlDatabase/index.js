import metricDefinitions from 'in-forge/plugins/azureSqlDatabase/metricDefinitions';
import iconSvgPath from 'in-forge/plugins/azureSqlDatabase/Icons/SqlDbIconPath';
import kpiDefinitions from 'in-forge/plugins/azureSqlDatabase/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

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
