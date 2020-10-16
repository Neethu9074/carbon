import metricDefinitions from 'in-forge/plugins/consul/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/consul/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.consul,
  pluginName: {
    singular: 'Consul Node',
    plural: 'Consul Nodes'
  },
  kpiDefinitions,
  metricDefinitions
});
