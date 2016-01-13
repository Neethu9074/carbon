export const plugins = {
  ec2: 'ec2',
  elasticsearch: 'elasticsearch',
  os: 'host',
  process: 'process',
  jira: 'jiraApplication',
  jvm: 'jvmRuntimePlatform',
  kafka: 'kafka',
  docker: 'docker',
  cassandra: 'cassandraNode',
  cassandraCluster: 'cassandraCluster',
  redis: 'redis',
  mongodb: 'mongoDb',
  mysql: 'mySqlDatabase',
  tomcat: 'tomcatApplicationContainer',
  nodejs: 'nodeJsRuntimePlatform',
  nodejsApp: 'genericNodejsApp',
  nodejsCluster: 'nodeJsCluster',
  javaWebApp: 'genericJavaWebapp',
  httpd: 'httpd',
  nginx: 'nginx',
  availabilityZone: 'availabilityZone',
  mssql: 'msSqlDatabase',
  phpfpm: 'phpFpmRuntimePlatform'
};

export const rels = {
  describes: 'com.instana.sdk.annotation.Describes',
  runsOn: 'com.instana.sdk.annotation.RunsOn',
  connectsTo: 'com.instana.sdk.annotation.ConnectsTo',
  availableThrough: 'com.instana.sdk.annotation.AvailableThrough',
  clusters: 'com.instana.sdk.annotation.Clusters'
};
