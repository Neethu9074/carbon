import { getIconSvgPath as getIconSvgPathForPlugin } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

const registry = {};
export default registry;
registry[plugins.mongodb] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'MongoDB' };
registry[plugins.redis] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'Redis' };
registry[plugins.elasticsearchCluster] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'Elasticsearch' };
registry[plugins.postgresql] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'PostgreSQL' };
registry[plugins.rabbitmq] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'RabbitMQ' };
registry[plugins.activemq] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'ActiveMQ' };
registry[plugins.kafkaCluster] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'Kafka' };
registry[plugins.hbase] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'HBase' };
registry[plugins.mariaDbDatabase] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'MariaDB' };
registry[plugins.mssql] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'MSSQL' };
registry[plugins.mysql] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'MySQL' };
registry[plugins.oracledb] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'OracleDB' };
registry[plugins.cassandraCluster] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'Cassandra' };
registry[plugins.clickHouse] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'ClickHouse' };
registry[plugins.dropwizard] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'Dropwizard' };
registry[plugins.springboot] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'Springboot' };
registry[plugins.tomcat] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'Tomcat' };
registry[plugins.glassfish] = { getIconSvgPath: getIconSvgPathForPlugin, label: 'Glassfish' };

export function getIconSvgPath(groupTypeId) {
  const config = registry[groupTypeId];
  if (config) {
    return config.getIconSvgPath(groupTypeId);
  }
  return null;
}

export function getLabel(groupTypeId) {
  const config = registry[groupTypeId];
  if (config) {
    return config.label;
  }
  return null;
}
