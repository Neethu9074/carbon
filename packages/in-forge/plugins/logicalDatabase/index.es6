import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/databaseServiceInstance/iconPath';

registerSnapshotDefinition({
  plugin: plugins.logicalDatabase,

  iconSvgPath,
  chartWiggleRoom: 20000,
  tableDefinition,
  metricDefinitions,

  pluginName: {
    singular: 'Database',
    plural: 'Databases'
  }
});
