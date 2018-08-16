import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/consul/iconPath';

registerSnapshotDefinition({
  plugin: plugins.consulCluster,
  iconSvgPath,
  pluginName: {
    singular: 'Consul Cluster',
    plural: 'Consul Clusters'
  },
  technologyDescriptor: {
    label: 'Consul'
  }
});
