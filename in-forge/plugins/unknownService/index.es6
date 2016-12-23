import {fullyQualifiedPlugins, plugins} from 'in-forge/constants';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';


const labelMapping = {
  [fullyQualifiedPlugins.logicalHttpConnection]: 'Unknown Http Service',
  [fullyQualifiedPlugins.logicalJdbcConnection]: 'Unknown Jdbc Service',
  [fullyQualifiedPlugins.logicalKafkaPublisherConnection]: 'Unknown Kafka Service',
  [fullyQualifiedPlugins.logicalKafkaConsumerConnection]: 'Unknown Kafka Service',
  [fullyQualifiedPlugins.logicalMongoDbConnection]: 'Unknown MongoDB Service',
  [fullyQualifiedPlugins.logicalRabbitMqPublisherConnection]: 'Unknown RabbitMQ Service',
  [fullyQualifiedPlugins.logicalRabbitMqConsumerConnection]: 'Unknown RabbitMQ Service',
  [fullyQualifiedPlugins.logicalCassandraConnection]: 'Unknown Cassandra Service',
  [fullyQualifiedPlugins.logicalElasticSearchConnection]: 'Unknown Elasticsearch Service'
};

registerSnapshotDefinition({
  plugin: plugins.unknownService,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'Unknown Service',
    plural: 'Unknown Services'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return labelMapping[snapshot.get('plugin')] || 'Unknown Service';
  }
});
