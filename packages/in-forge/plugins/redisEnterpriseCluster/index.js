import metricDefinitions from 'in-forge/plugins/redisEnterpriseCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/redisEnterpriseCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/redis/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.redisEnterpriseCluster,
  pluginName: {
    singular: 'Redis Enterprise Cluster',
    plural: 'Redis Enterprise Clusters'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Redis Enterprise'
  }
});
