export const plugins = {
  ec2: 'com.instana.forge.hardware.virtual.ec2.Ec2',
  elasticsearch: 'com.instana.forge.infrastructure.database.elasticsearch.Elasticsearch',
  os: 'com.instana.forge.infrastructure.os.host.Host',
  process: 'com.instana.forge.infrastructure.os.process.Process',
  jira: 'com.instana.forge.infrastructure.application.jira.JiraApplication',
  jvm: 'com.instana.forge.infrastructure.runtime.jvm.JvmRuntimePlatform',
  docker: 'com.instana.forge.infrastructure.virtualization.docker.Docker',
  cassandra: 'com.instana.forge.infrastructure.database.cassandra.Cassandra',
  redis: 'com.instana.forge.infrastructure.cache.redis.Redis',
  mongodb: 'com.instana.forge.infrastructure.database.mongodb.MongoDb',
  mysql: 'com.instana.forge.infrastructure.database.mysql.MySqlDatabase',
  tomcat: 'com.instana.forge.infrastructure.application.container.tomcat.TomcatApplicationContainer',
  nodejs: 'com.instana.forge.infrastructure.runtime.nodejs.NodeJsRuntimePlatform',
  nodejsApp: 'com.instana.forge.infrastructure.application.nodejs.GenericNodejsApp',
  javaWebApp: 'com.instana.forge.infrastructure.application.java.webapp.GenericJavaWebapp'
};

export const rels = {
  describes: 'com.instana.sdk.annotation.Describes',
  runsOn: 'com.instana.sdk.annotation.RunsOn',
  connectsTo: 'com.instana.sdk.annotation.ConnectsTo',
  availableThrough: 'com.instana.sdk.annotation.AvailableThrough',
  clusters: 'com.instana.sdk.annotation.Clusters'
};
