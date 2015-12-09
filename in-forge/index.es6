// require all forge modules inside this one, as
// this is the only module required by the application.

import './com.instana.forge.infrastructure.application.container.tomcat.TomcatApplicationContainer';
import './com.instana.forge.infrastructure.application.jira.JiraApplication';
import './com.instana.forge.infrastructure.cache.redis.Redis';
import './com.instana.forge.infrastructure.database.cassandra.CassandraNode';
import './com.instana.forge.infrastructure.database.cassandra.CassandraCluster';
import './com.instana.forge.infrastructure.database.elasticsearch.Elasticsearch';
import './com.instana.forge.infrastructure.database.mongodb.MongoDb';
import './com.instana.forge.infrastructure.database.mysql.MySqlDatabase';
import './com.instana.forge.infrastructure.os.host.Host';
import './com.instana.forge.infrastructure.os.process.Process';
import './com.instana.forge.infrastructure.runtime.jvm.JvmRuntimePlatform';
import './com.instana.forge.infrastructure.messaging.kafka.Kafka';
import './com.instana.forge.infrastructure.virtualization.docker.Docker';
import './com.instana.forge.hardware.virtual.ec2.Ec2';
import './com.instana.forge.infrastructure.runtime.nodejs.NodeJsRuntimePlatform';
import './com.instana.forge.infrastructure.application.nodejs.GenericNodejsApp';
import './com.instana.forge.infrastructure.runtime.nodejs.NodeJsCluster';
import './com.instana.forge.infrastructure.application.java.webapp.GenericJavaWebapp';
import './com.instana.forge.infrastructure.webserver.httpd.Httpd';
import './com.instana.forge.hardware.AvailabilityZone';
import './com.instana.forge.infrastructure.webserver.nginx.Nginx';
import './com.instana.forge.infrastructure.database.mssql.MsSqlDatabase';
