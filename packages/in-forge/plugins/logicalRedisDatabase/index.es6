import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/redis/iconPath';

registerSnapshotDefinition({
  plugin: plugins.logicalRedisDatabase,

  iconSvgPath,
  tableDefinition,
  metricDefinitions,

  pluginName: {
    singular: 'Redis Database',
    plural: 'Redis Databases'
  },

  chartWiggleRoom: 20000
});
