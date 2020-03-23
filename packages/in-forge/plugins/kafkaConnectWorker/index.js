import metricDefinitions from 'in-forge/plugins/kafkaConnectWorker/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kafkaConnectWorker/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/kafkaConnectWorker/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kafkaConnectWorker,
  pluginName: {
    singular: 'KafkaConnect Worker',
    plural: 'KafkaConnect Workers'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'KafkaConnectWorker'
  }
});
