import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/clickHouseDatabase/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import tableDefinition from './tableDefinition';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.clickHouseDatabase,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  tableDefinition,
  pluginName: {
    singular: 'ClickHouse DB',
    plural: 'ClickHouse DBs'
  },
  technologyDescriptor: {
    label: 'ClickHouse'
  }
});
