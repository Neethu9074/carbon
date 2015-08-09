

// require all forge modules inside this one, as
// this is the only module required by the application.

import './com.instana.forge.infrastructure.cache.redis.Redis';
import './com.instana.forge.infrastructure.database.cassandra.Cassandra';
import './com.instana.forge.infrastructure.database.elasticsearch.Elasticsearch';
import './com.instana.forge.infrastructure.database.mongodb.MongoDB';
import './com.instana.forge.infrastructure.os.OS';
import './com.instana.forge.infrastructure.os.Process';
import './com.instana.forge.infrastructure.runtime.jvm.JVMRuntimePlatform';
import './com.instana.forge.infrastructure.virtualization.Docker';
import './com.instana.forge.infrastructure.virtualization.EC2';
