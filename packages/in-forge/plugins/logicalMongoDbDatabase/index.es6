import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/mongoDb/iconPath';

registerSnapshotDefinition({
  plugin: plugins.logicalMongoDbDatabase,

  iconSvgPath,
  tableDefinition,
  metricDefinitions,

  pluginName: {
    singular: 'MongoDB Database',
    plural: 'MongoDB Databases'
  },

  chartWiggleRoom: 20000
});
