// require all forge modules inside this one, as
// this is the only module required by the application.

import './dropwizardApplicationContainer';
import './jBossAsApplicationContainer';
import './tomcatApplicationContainer';
import './jiraApplication';
import './redis';
import './rabbitMq';
import './cassandraNode';
import './cassandraCluster';
import './elasticsearchNode';
import './elasticsearchCluster';
import './mongoDb';
import './mySqlDatabase';
import './mariaDbDatabase';
import './postgreSqlDatabase';
import './host';
import './process';
import './jvmRuntimePlatform';
import './kafka';
import './docker';
import './ec2';
import './nodeJsRuntimePlatform';
import './genericNodejsApp';
import './nodeJsCluster';
import './genericJavaWebapp';
import './httpd';
import './availabilityZone';
import './nginx';
import './msSqlDatabase';
import './phpFpmRuntimePlatform';
import './springbootApplicationContainer';
import './msiis';
import './genericHardware';
import './genericZone';
import './unmonitoredHost';
import './hAProxy';
import './oracleDB';


// TODO TEMPORARY HACK FOR PROCESS VIEW
import './dummyJavaApp';
import './dummyMysqlSchema';
import './dummyMysqlDb';
import './dummyTomcat';
import './dummyConnection';
