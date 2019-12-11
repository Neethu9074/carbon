import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/consulCluster/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from 'in-forge/plugins/consul/iconPath';

registerSnapshotDefinition({
  plugin: plugins.consulCluster,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'Consul Cluster',
    plural: 'Consul Clusters'
  },
  technologyDescriptor: {
    label: 'Consul'
  }
});
