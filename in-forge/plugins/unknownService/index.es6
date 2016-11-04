import {fullyQualifiedPlugins, plugins} from 'in-forge/constants';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


const iconMapping = {
  [fullyQualifiedPlugins.logicalHttpConnection]: plugins.unknownService,
  [fullyQualifiedPlugins.logicalJdbcConnection]: plugins.jvmRuntimePlatform,
  [fullyQualifiedPlugins.logicalKafkaPublisherConnection]: plugins.kafka,
  [fullyQualifiedPlugins.logicalKafkaConsumerConnection]: plugins.kafka,
  [fullyQualifiedPlugins.logicalMongoDbConnection]: plugins.mongoDb,
  [fullyQualifiedPlugins.logicalRabbitMqPublisherConnection]: plugins.rabbitMq,
  [fullyQualifiedPlugins.logicalRabbitMqConsumerConnection]: plugins.rabbitMq,
  [fullyQualifiedPlugins.logicalCassandraConnection]: plugins.cassandraNode,
  [fullyQualifiedPlugins.logicalElasticSearchConnection]: plugins.elasticsearchNod
};

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
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'Unknown Service',
    plural: 'Unknown Services'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return labelMapping[snapshot.get('plugin')] || 'Unknown Service';
  },

  getIcon(snapshot) {
    return iconMapping[snapshot.get('plugin')] || plugins.unknownService;
  }
});
