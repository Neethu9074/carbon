import metricDefinitions from 'in-forge/plugins/kafkaConnectConnector/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/kafkaConnectConnector/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/kafkaConnectConnector/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.kafkaConnectConnector,
  pluginName: {
    singular: 'Kafka Connector',
    plural: 'Kafka Connectors'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  technologyDescriptor: {
    label: 'KafkaConnector'
  }
});
