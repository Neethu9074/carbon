import iconSvgPath from 'in-forge/plugins/azureSqlElasticPool/Icons/ElasticPoolIconPath';
import metricDefinitions from 'in-forge/plugins/azureSqlElasticPool/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/azureSqlElasticPool/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.azureSqlElasticPool,
  pluginName: {
    singular: 'Azure SQL Elastic Pool',
    plural: 'Azure SQL Elastic Pools'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
