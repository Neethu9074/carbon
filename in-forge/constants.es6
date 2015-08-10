export const plugins = {
  ec2: 'com.instana.forge.infrastructure.virtualization.EC2',
  elasticsearch: 'com.instana.forge.infrastructure.database.elasticsearch.Elasticsearch',
  os: 'com.instana.forge.infrastructure.os.OS',
  process: 'com.instana.forge.infrastructure.os.Process',
  jvm: 'com.instana.forge.infrastructure.runtime.jvm.JVMRuntimePlatform',
  docker: 'com.instana.forge.infrastructure.virtualization.Docker',
  cassandra: 'com.instana.forge.infrastructure.database.cassandra.Cassandra',
  redis: 'com.instana.forge.infrastructure.cache.redis.Redis',
  mongodb: 'com.instana.forge.infrastructure.database.mongodb.MongoDB'
};

export const rels = {
  describes: 'com.instana.sdk.annotation.Describes'
};
