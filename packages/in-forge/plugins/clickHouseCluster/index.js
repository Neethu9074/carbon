import metricDefinitions from 'in-forge/plugins/clickHouseCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/clickHouseCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.clickHouseCluster,
  pluginName: {
    singular: 'ClickHouse Cluster',
    plural: 'ClickHouse Clusters'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'ClickHouse Cluster'
  }
});
