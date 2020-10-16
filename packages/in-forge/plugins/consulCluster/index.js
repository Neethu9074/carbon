import metricDefinitions from 'in-forge/plugins/consulCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/consulCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.consulCluster,
  pluginName: {
    singular: 'Consul Cluster',
    plural: 'Consul Clusters'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Consul'
  }
});
