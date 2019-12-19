import metricDefinitions from 'in-forge/plugins/consul/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/consul/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/consul/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.consul,
  pluginName: {
    singular: 'Consul Node',
    plural: 'Consul Nodes'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
