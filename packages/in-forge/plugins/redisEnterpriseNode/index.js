import metricDefinitions from 'in-forge/plugins/redisEnterpriseNode/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/redisEnterpriseNode/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/redis/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.redisEnterpriseNode,
  pluginName: {
    singular: 'Redis Enterprise Node',
    plural: 'Redis Enterprise Nodes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Redis Enterprise'
  }
});
