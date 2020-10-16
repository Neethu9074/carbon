import metricDefinitions from 'in-forge/plugins/packet/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/packet/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.packet,
  pluginName: {
    singular: 'Packet Instance',
    plural: 'Packet Instances'
  },
  metricDefinitions,
  kpiDefinitions
});
