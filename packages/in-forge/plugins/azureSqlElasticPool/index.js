import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/azureSqlElasticPool/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './Icons/ElasticPoolIconPath';

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
