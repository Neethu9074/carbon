import metricDefinitions from 'in-forge/plugins/clickHouseDatabase/metricDefinitions';
import tableDefinition from 'in-forge/plugins/clickHouseDatabase/tableDefinition';
import kpiDefinitions from 'in-forge/plugins/clickHouseDatabase/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/clickHouseDatabase/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.clickHouseDatabase,
  pluginName: {
    singular: 'ClickHouse DB',
    plural: 'ClickHouse DBs'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'ClickHouse'
  },
  tableDefinition
});
