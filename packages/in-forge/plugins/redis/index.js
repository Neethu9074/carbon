import metricDefinitions from 'in-forge/plugins/redis/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/redis/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.redis,
  pluginName: {
    singular: 'Redis Node',
    plural: 'Redis Nodes'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Redis'
  }
});
