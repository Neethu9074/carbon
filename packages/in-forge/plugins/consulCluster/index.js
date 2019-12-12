import metricDefinitions from 'in-forge/plugins/consulCluster/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/consulCluster/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/consul/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.consulCluster,
  pluginName: {
    singular: 'Consul Cluster',
    plural: 'Consul Clusters'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'Consul'
  }
});
