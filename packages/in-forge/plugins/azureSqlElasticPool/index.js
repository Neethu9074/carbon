import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './Icons/ElasticPoolIconPath';

registerSnapshotDefinition({
  plugin: plugins.azureSqlElasticPool,
  pluginName: {
    singular: 'Azure SQL Elastic Pool',
    plural: 'Azure SQL Elastic Pools'
  },
  iconSvgPath,
  metricDefinitions
});
