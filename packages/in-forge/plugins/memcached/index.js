import metricDefinitions from 'in-forge/plugins/memcached/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/memcached/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.memcached,
  pluginName: {
    singular: 'Memcached Nodes',
    plural: 'Memcached Nodes'
  },
  kpiDefinitions,
  technologyDescriptor: {
    label: 'Memcached'
  },
  metricDefinitions
});
