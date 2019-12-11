import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';
import kpiDefinitions from 'in-forge/plugins/consul/kpiDefinitions';

registerSnapshotDefinition({
  plugin: plugins.consul,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  pluginName: {
    singular: 'Consul Node',
    plural: 'Consul Nodes'
  }
});
