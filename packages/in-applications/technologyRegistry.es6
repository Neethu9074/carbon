import { get } from 'lodash';

import { getIconSvgPath as getIconSvgPathForPlugin } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

const registry = {};
export default registry;
registry[plugins.mongodb] = { label: 'MongoDB' };
registry[plugins.redis] = { label: 'Redis' };
registry[plugins.elasticsearchCluster] = { label: 'Elasticsearch' };
registry[plugins.postgresql] = { label: 'PostgreSQL' };
registry[plugins.rabbitmq] = { label: 'RabbitMQ' };
registry[plugins.activemq] = { label: 'ActiveMQ' };
registry[plugins.kafkaCluster] = { label: 'Kafka' };
registry[plugins.hbase] = { label: 'HBase' };
registry[plugins.mariaDbDatabase] = { label: 'MariaDB' };
registry[plugins.mssql] = { label: 'MSSQL' };
registry[plugins.mysql] = { label: 'MySQL' };
registry[plugins.oracledb] = { label: 'OracleDB' };
registry[plugins.cassandraCluster] = { label: 'Cassandra' };
registry[plugins.clickHouse] = { label: 'ClickHouse' };
registry[plugins.dropwizard] = { label: 'Dropwizard' };
registry[plugins.springboot] = { label: 'Springboot' };
registry[plugins.tomcat] = { label: 'Tomcat' };
registry[plugins.glassfish] = { label: 'Glassfish' };

export function getIconSvgPath(groupTypeId) {
  return get(registry[groupTypeId], ['getIconSvgPath'], getIconSvgPathForPlugin)(groupTypeId);
}

export function getLabel(groupTypeId) {
  const config = registry[groupTypeId];
  if (config) {
    return config.label;
  }
  return null;
}
