import {fullyQualifiedPlugins, plugins} from 'in-forge/constants';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as icon from 'in-sdk/iconRegistry';

import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.unknownService,
  'Unknown Service',
  'Unknown Services'
);

addLabelFinder(constants.plugins.unknownService,
  snapshot => {
    const map = {};
    map[fullyQualifiedPlugins.logicalHttpConnection] = 'Unknown Http Service';
    map[fullyQualifiedPlugins.logicalJdbcConnection] = 'Unknown Jdbc Service';
    map[fullyQualifiedPlugins.logicalMongoDbConnection] = 'Unknown MongoDB Service';
    map[fullyQualifiedPlugins.logicalRabbitMqPublisherConnection] = 'Unknown RabbitMQ Service';
    map[fullyQualifiedPlugins.logicalRabbitMqConsumerConnection] = 'Unknown RabbitMQ Service';
    map[fullyQualifiedPlugins.logicalCassandraConnection] = 'Unknown Cassandra Service';
    map[fullyQualifiedPlugins.logicalElasticSearchConnection] = 'Unknown Elastic Service';
    return returnMappingOrDefault(snapshot, map, 'Unknown Service');
  }
);

icon.addIconToRegistry({
  id: constants.plugins.unknownService,
  image: iconPath
});

icon.addMapping(
  constants.plugins.unknownService,
  snapshot => {
    const map = {};
    map[fullyQualifiedPlugins.logicalHttpConnection] = plugins.unknownService;
    map[fullyQualifiedPlugins.logicalJdbcConnection] = plugins.jvmRuntimePlatform;
    map[fullyQualifiedPlugins.logicalMongoDbConnection] = plugins.mongoDb;
    map[fullyQualifiedPlugins.logicalRabbitMqPublisherConnection] = plugins.rabbitMq;
    map[fullyQualifiedPlugins.logicalRabbitMqConsumerConnection] = plugins.rabbitMq;
    map[fullyQualifiedPlugins.logicalCassandraConnection] = plugins.cassandraNode;
    map[fullyQualifiedPlugins.logicalElasticSearchConnection] = plugins.elasticsearchNod;
    return returnMappingOrDefault(snapshot, map);
  }
);

function returnMappingOrDefault(snapshot, map, defaultvalue = 'unknown') {
  const connectionPlugin = snapshot.getIn(['data', 'connectionPlugin']);
  const value = map[connectionPlugin];
  return value ? value : defaultvalue;
}
