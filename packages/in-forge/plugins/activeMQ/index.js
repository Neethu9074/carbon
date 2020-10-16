import metricDefinitions from 'in-forge/plugins/activeMQ/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/activeMQ/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.activeMQ,
  pluginName: {
    singular: 'ActiveMQ',
    plural: 'ActiveMQs'
  },
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'ActiveMQ'
  }
});
