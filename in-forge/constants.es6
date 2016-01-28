export const plugins = {
  availabilityZone: 'availabilityZone',
  cassandra: 'cassandraNode',
  cassandraCluster: 'cassandraCluster',
  docker: 'docker',
  ec2: 'ec2',
  elasticsearch: 'elasticsearch',
  httpd: 'httpd',
  javaWebApp: 'genericJavaWebapp',
  jira: 'jiraApplication',
  jvm: 'jvmRuntimePlatform',
  kafka: 'kafka',
  mongodb: 'mongoDb',
  mssql: 'msSqlDatabase',
  mysql: 'mySqlDatabase',
  nginx: 'nginx',
  nodejs: 'nodeJsRuntimePlatform',
  nodejsApp: 'genericNodejsApp',
  nodejsCluster: 'nodeJsCluster',
  os: 'host',
  phpfpm: 'phpFpmRuntimePlatform',
  process: 'process',
  redis: 'redis',
  tomcat: 'tomcatApplicationContainer',
  msiis: 'msiis'
};

export const rels = {
  describes: 'com.instana.sdk.annotation.Describes',
  runsOn: 'com.instana.sdk.annotation.RunsOn',
  connectsTo: 'com.instana.sdk.annotation.ConnectsTo',
  availableThrough: 'com.instana.sdk.annotation.AvailableThrough',
  clusters: 'com.instana.sdk.annotation.Clusters'
};
