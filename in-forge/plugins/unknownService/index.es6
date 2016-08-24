import {addMapping as addIconMapping, addIconToRegistry} from 'in-sdk/iconRegistry';
import {fullyQualifiedPlugins, plugins} from 'in-forge/constants';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from './icon.svg';

setHumanReadablePluginName(
  plugins.unknownService,
  'Unknown Service',
  'Unknown Services'
);

addLabelFinder(plugins.unknownService,
  snapshot => {
    const map = {};
    map[fullyQualifiedPlugins.logicalHttpConnection] = 'Unknown Http Service';
    map[fullyQualifiedPlugins.logicalJdbcConnection] = 'Unknown Jdbc Service';
    map[fullyQualifiedPlugins.logicalKafkaPublisherConnection] = 'Unknown Kafka Service';
    map[fullyQualifiedPlugins.logicalKafkaConsumerConnection] = 'Unknown Kafka Service';
    map[fullyQualifiedPlugins.logicalMongoDbConnection] = 'Unknown MongoDB Service';
    map[fullyQualifiedPlugins.logicalRabbitMqPublisherConnection] = 'Unknown RabbitMQ Service';
    map[fullyQualifiedPlugins.logicalRabbitMqConsumerConnection] = 'Unknown RabbitMQ Service';
    map[fullyQualifiedPlugins.logicalCassandraConnection] = 'Unknown Cassandra Service';
    map[fullyQualifiedPlugins.logicalElasticSearchConnection] = 'Unknown Elastic Service';
    return returnMappingOrDefault(snapshot, map, 'Unknown Service');
  }
);

addIconToRegistry({
  id: plugins.unknownService,
  image: iconPath
});

addIconMapping(
  plugins.unknownService,
  snapshot => {
    const map = {};
    map[fullyQualifiedPlugins.logicalHttpConnection] = plugins.unknownService;
    map[fullyQualifiedPlugins.logicalJdbcConnection] = plugins.jvmRuntimePlatform;
    map[fullyQualifiedPlugins.logicalKafkaPublisherConnection] = plugins.kafka;
    map[fullyQualifiedPlugins.logicalKafkaConsumerConnection] = plugins.kafka;
    map[fullyQualifiedPlugins.logicalMongoDbConnection] = plugins.mongoDb;
    map[fullyQualifiedPlugins.logicalRabbitMqPublisherConnection] = plugins.rabbitMq;
    map[fullyQualifiedPlugins.logicalRabbitMqConsumerConnection] = plugins.rabbitMq;
    map[fullyQualifiedPlugins.logicalCassandraConnection] = plugins.cassandraNode;
    map[fullyQualifiedPlugins.logicalElasticSearchConnection] = plugins.elasticsearchNod;
    return returnMappingOrDefault(snapshot, map);
  }
);

function returnMappingOrDefault(snapshot, map, defaultvalue = plugins.unknownService) {
  const connectionPlugin = snapshot.get('plugin');
  const value = map[connectionPlugin];
  return value ? value : defaultvalue;
}
