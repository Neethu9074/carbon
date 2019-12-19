import metricDefinitions from 'in-forge/plugins/redis/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/redis/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/redis/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.redis,
  pluginName: {
    singular: 'Redis Node',
    plural: 'Redis Nodes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Redis'
  }
});
