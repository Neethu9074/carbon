/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import featureFlags from '../../dev/featureFlags';

window.instana = {
  user: {
    email: 'tom@example.com',
    tenants: [
      {
        tenantKey: 'instana',
        role: {
          canConfigureEventsAndAlerts: true
        }
      }
    ]
  },
  searchFields: {
    v2: [
      {
        keyword: 'event.severity',
        description: 'Problem severity: critical or warning',
        context: 'events',
        termType: 'string',
        fixedValues: ['critical', 'warning']
      },
      {
        keyword: 'event.id',
        description: 'Event ID',
        context: 'events',
        termType: 'id',
        fixedValues: []
      },
      {
        keyword: 'entity.containerd.name',
        description: 'Name of the containerd container',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'selfMonitoring.tenant',
        description: 'Tenant name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.phmc.vios.name',
        description: 'pHMC System name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.ecs.clusterArn',
        description: 'AWS ECS Cluster ARN',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.otelprocess.id',
        description: 'Process ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.pluginId',
        description: 'Plugin ID of the entity',
        context: 'entities',
        termType: 'id',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmdatapower.domain.quiesceState',
        description: 'IBM DataPower domain quiesce state',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.dropwizard.counter',
        description: 'Available Dropwizard counters',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.emr.clusterId',
        description: 'EMR Cluster ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.storage.blob.name',
        description: 'Azure Blob name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.netcore.app.name',
        description: '.Net Core app name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.datastore.projectId',
        description: 'Google Cloud Datastore Project ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.clr.dependency',
        description: 'Application dependencies and versions in the form module@version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.qm.name',
        description: 'IBM MQ queue manager name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tibcoems.serverName',
        description: 'Name of Tibco EMS Server',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.servicebus.queue.name',
        description: 'Azure service bus queue name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.garden.ip',
        description: 'IP of the garden container',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.syntheticpop.locationDisplayName',
        description: 'Synthetic PoP location display name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.alicloud.oss.instanceId',
        description: 'AliCloud OSS Instance ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.process.runsIn',
        description: 'Whether a process is running in a Docker container',
        context: 'entities',
        termType: 'string',
        fixedValues: ['docker']
      },
      {
        keyword: 'entity.jvm.prometheus.stateset',
        description: 'Available Prometheus state set metrics',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.channel.type',
        description: 'IBM MQ channel type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmz.ctg.system_id',
        description: 'system_id of CTG for z/OS',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.alicloud.rocketmq',
        description: 'AliCloud RocketMq',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.nomad.jobName',
        description: 'Name of the nomad job',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.alicloud.oss.userid',
        description: 'AliCloud OSS User Instance',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.function.name',
        description: 'Azure Function name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.cloudfoundry.application.id',
        description: 'Cloud Foundry Application ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.container.restartCount',
        description: 'Kubernetes Container Restart Count',
        context: 'entities',
        termType: 'long',
        fixedValues: []
      },
      {
        keyword: 'entity.agent.vm.name',
        description: 'Agent VM Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.cluster.distribution',
        description: 'Kubernetes Cluster Distribution',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.drbd.name',
        description: 'DRBD Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.alicloud.rocketmq.instanceName',
        description: 'AliCloud RocketMq Instance Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.remote.host.name',
        description: 'Host name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.crystal.version',
        description: 'Crystal version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.remote.host.memory',
        description: 'Available memory',
        context: 'entities',
        termType: 'long',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.node.uid',
        description: 'Kubernetes Node UID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ace.integrationServer.name',
        description: 'ACE integrationServer name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.elasticsearch.name',
        description: 'Elasticsearch node name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.docker.containerName',
        description: 'Names of the docker container',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.micrometer.timeGauge',
        description: 'Available Micrometer time gauges',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.lxc.networkInterface',
        description: 'LXC container network interface',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.podman.label',
        description: 'Labels of the Podman container',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmz.os.smfid',
        description: 'System Management Facilities id of z/OS',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.application.name',
        description: 'The name of the application',
        context: 'applications',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.pod.volumeName',
        description: 'Volumes attached to the Pod',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.finagle.histograms',
        description: 'Finagle Histograms',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.id',
        description: 'ID of the entity',
        context: 'entities',
        termType: 'id',
        fixedValues: []
      },
      {
        keyword: 'event.type',
        description: 'Event type',
        context: 'events',
        termType: 'string',
        fixedValues: [
          'change',
          'changeAndPresence',
          'critical',
          'event',
          'incident',
          'issue',
          'monitoringIssue',
          'objectiveViolation',
          'offline',
          'online',
          'warning'
        ]
      },
      {
        keyword: 'entity.azure.service.sqldb.name',
        description: 'The name of the SQL Database service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedoapp.tuxedoService.name',
        description: 'Tuxedo Service Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kafka.version',
        description: 'Version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ec2.instanceId',
        description: 'Instance ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.mq.brokerName',
        description: 'Amazon MQ broker name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.powervc.hypervisor.name',
        description: 'PowerVC Hypervisor name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.redshift.node.id',
        description: 'AWS Redshift Node ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmdatapower.service.name',
        description: 'IBM DataPower service name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmdatapower.service.status',
        description: 'IBM DataPower service status',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.otel.attribute',
        description: 'OpenTelemetry Resource Attribute',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.cloudfoundry.space.id',
        description: 'Cloud Foundry Space ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.queue.name',
        description: 'IBM MQ queue name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.agent.gitops.remoteUri',
        description: 'Agent GitOps remote URI',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.ecs.taskDefinitionArn',
        description: 'AWS ECS Task Definition ARN',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ruby.app.dependency',
        description: 'Application dependencies and versions in the form gem@version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.cluster.managedBy',
        description: 'Kubernetes Cluster ManagedBy',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.app.name',
        description: 'Application name as defined in the MANIFEST file',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.vsphere.vm.name',
        description: 'vSphere Virtual Machine name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tibcoas.proxy.name',
        description: 'Tibco ActiveSpaces proxy name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.documentdb.elastic.cluster.name',
        description: 'AWS DocumentDb Elastic cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.autoscaling.groupName',
        description: 'Auto Scaling Group Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmInfosphereCdc.name',
        description: 'IbmInfosphere CDC name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.dropwizard.counter',
        description: 'Available Dropwizard counters',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.openshift.deploymentconfig.name',
        description: 'Openshift DeploymentConfig Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.netcore.app.target',
        description: '.Net Core target version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.node.label',
        description: 'Labels of Node',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.kind',
        description: 'The kind of the resource',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ace.messageFlow.state',
        description: 'ACE Message Flow State',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.label',
        description: 'Label/name of entity',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.host.gpu.model',
        description: 'GPU Model',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.powervc.region.name',
        description: 'PowerVC Region name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ruby.version',
        description: 'Ruby version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.micrometer.functionTimer',
        description: 'Available Micrometer function timers',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.host.service.servicename',
        description: 'Service name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.mqttchannel.type',
        description: 'IBM MQ MQTT channel type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.cluster.version',
        description: 'Kubernetes Cluster Version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.vsphere.datacenter.name',
        description: 'vSphere datacenter name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.micrometer.counter',
        description: 'Available Micrometer counters',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'event.text',
        description: 'Event description',
        context: 'events',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.server.state',
        description: 'The state of Tuxedo server',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.cloudfoundry.space.name',
        description: 'Cloud Foundry Space name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.containerd.label',
        description: 'Labels of the Containerd container',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.alicloud.rocketmq.topic',
        description: 'AliCloud RocketMq Topic',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.agent.gitops.remoteName',
        description: 'Agent GitOps remote name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.appsync.apiName',
        description: 'AppSync API Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.zhmc.console.name',
        description: 'zHMC console name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.sql.version',
        description: 'Cloud SQL database version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.nodejs.version',
        description: 'Version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.drbd.resource.name',
        description: 'DRBD resource name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.ecs.taskDefinitionName',
        description: 'AWS ECS Task Definition Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tibcoems.queue.name',
        description: 'Name of the queue',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kafkaconnect.version',
        description: 'Version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.websphere.webModules',
        description: 'Deployed web modules',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.elasticsearch.id',
        description: 'Elasticsearch node id',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jboss.serverName',
        description: 'JBoss Server Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmdatapower.appliance.name',
        description: 'IBM DataPower appliance name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.cockroach.cluster.name',
        description: 'CockroachDB cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.weblogic.port',
        description: 'Port',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.accountId',
        description: 'Amazon Account ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmqmft.zone.name',
        description: 'IBM MQ Managed File Transfer Zone Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.couchbase.bucket',
        description: 'Available buckets',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.vsphere.esxihost.name',
        description: 'vSphere ESXi host name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.prometheus.histogram',
        description: 'Available Prometheus histogram metrics',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.dropwizard.meter',
        description: 'Available Dropwizard meters',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.ebs.volumeId',
        description: 'Volume ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.domain.tuxconfig',
        description: 'Tuxedo Domain TUXCONFIG',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.cloudfoundry.organization.id',
        description: 'Cloud Foundry Organization ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.documentdb.cluster.name',
        description: 'AWS DocumentDb cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.rabbitmq.cluster.name',
        description: 'RabbitMQ cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.zone',
        description: 'Availability/custom zone',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.namespace.uid',
        description: 'Kubernetes Namespace UID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.machinelearning.name',
        description: 'The name of the Machine Learning service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.appservice.name',
        description: 'The name of the App Service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.prometheus.info',
        description: 'Available Prometheus info metrics',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.micrometer.gauge',
        description: 'Available Micrometer gauges',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.server.lmid',
        description: 'The logical machine identifier of the Tuxedo server',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.biztalk.application',
        description: 'BizTalk Application',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.otel.histogram',
        description: 'OpenTelemetry Histograms',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.ecs.containerId',
        description: 'ID of the ECS container',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmopenstack.computeinstance.name',
        description: 'IbmOpenstack Compute Instance name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.host.service.displayname',
        description: 'Display name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.prometheus.summary',
        description: 'Available Prometheus summary metrics',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.zhmc.cpc.name',
        description: 'zHMC Cpc name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.go.app.name',
        description: 'Go app name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.container.name',
        description: 'Kubernetes Container Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.finagle.gauges',
        description: 'Finagle Gauges',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tibcobw.appinst.name',
        description: 'Application Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.sql.name',
        description: 'Cloud SQL instance name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.persistentVolumeClaim.name',
        description: 'Kubernetes PersistentVolumeClaim Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.endpoint.id',
        description: 'The ID of the endpoint',
        context: 'endpoints',
        termType: 'id',
        fixedValues: []
      },
      {
        keyword: 'entity.podman.restartCount',
        description: 'Container Restart Count',
        context: 'entities',
        termType: 'long',
        fixedValues: []
      },
      {
        keyword: 'entity.crystal.app.name',
        description: 'Crystal app name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.netcore.runtime.version',
        description: '.Net Core runtime version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.persistentVolumeClaim.storageClassName',
        description: 'Kubernetes PersistentVolumeClaim Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.lambda.functionname',
        description: 'AWS Lambda Function Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.qm.status',
        description: 'IBM MQ queue manager status',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.remote.host.os.name',
        description: 'OS name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.micrometer.functionCounter',
        description: 'Available Micrometer function counters',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.apim.api.name',
        description: 'The API name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tomcat.servlet',
        description: 'Servlets',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'event.state',
        description: 'Event state: OPEN, CLOSED, or MANUALLY_CLOSED',
        context: 'events',
        termType: 'string',
        fixedValues: ['closed', 'manually_closed', 'open']
      },
      {
        keyword: 'entity.opc.name',
        description: 'Instance Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedoapp.name',
        description: 'Tuxedo Application Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.statefulset.label',
        description: 'Labels of StatefulSet',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.datafactory.name',
        description: 'The name of the DataFactory service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tanzu.foundation.name',
        description: 'Tanzu foundation name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.storage.projectNumber',
        description: 'Cloud Storage project number',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.remote.host.mac',
        description: 'MAC addresses',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.application.id',
        description: 'The ID of the application',
        context: 'applications',
        termType: 'id',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.job.label',
        description: 'Labels of Job',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.id',
        description: 'Resource ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmi.os.partitionId',
        description: 'Partition ID of your IBM i instance',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.consul.cluster.name',
        description: 'Consul cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ace.integrationServer.type',
        description: 'ACE integrationServer type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.micrometer.timer',
        description: 'Available Micrometer timers',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedoapp.serviceBrokerProject.name',
        description: 'Service Broker Project Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.apigateway.protocol',
        description: 'ApiGateway Protocol',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.purview.name',
        description: 'The name of the Purview service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.dropwizard.gauge',
        description: 'Available Dropwizard gauges',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.agent.version',
        description: 'Agent version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'selfMonitoring.unit',
        description: 'Unit name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.beanstalk.solution',
        description: 'Beanstalk solution stack',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.podman.image',
        description: 'Name of the Podman image',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tibcobw.appnode.appspace',
        description: 'The name of AppSpace',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.ebs.encrypted',
        description: 'Volume Encrypted',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.build',
        description: 'JVM build, e.g. 25.102-b14',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.listener.name',
        description: 'IBM MQ listener name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.namespace.labels',
        description: 'Labels of Namespace',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.selfType',
        description: 'Type of the entity',
        context: 'entities',
        termType: 'string',
        fixedValues: [
          'ace.integrationNode',
          'ace.integrationServer',
          'ace.messageFlow',
          'activemq',
          'activemqartemis',
          'agent',
          'agentStatistics',
          'alicloud',
          'alicloud.oss',
          'alicloud.oss.bucket',
          'alicloud.rds',
          'alicloud.rds.mysql',
          'alicloud.rocketmq',
          'alicloud.rocketmq.group',
          'alicloud.rocketmq.instance',
          'alicloud.rocketmq.topic',
          'annotator',
          'api',
          'ApiGateway',
          'apigateway',
          'application',
          'appservice',
          'appsync',
          'autoscaling',
          'availabilityZone',
          'aws',
          'aws.apigateway',
          'aws.appsync',
          'aws.autoscaling',
          'aws.beanstalk',
          'aws.cloudfront',
          'aws.documentdb',
          'aws.dynamodb',
          'aws.ebs',
          'aws.ec',
          'aws.ecs.ecscontainer',
          'aws.ecs.ecstask',
          'aws.elb',
          'aws.emr',
          'aws.es',
          'aws.iotcore',
          'aws.kinesis',
          'aws.lambda.function',
          'aws.mq',
          'aws.msk',
          'aws.rds',
          'aws.redshift',
          'aws.s3',
          'aws.sns',
          'aws.sqs',
          'aws.timestream',
          'azure',
          'azure.storage',
          'azure.storage.blob',
          'azure.storage.queue',
          'balancer',
          'beanstalk',
          'beeinstana',
          'biztalk',
          'broker',
          'cache',
          'cassandra',
          'cassandraCluster',
          'ceph',
          'cfApplication',
          'cfOrganization',
          'cfSpace',
          'clickhouse',
          'clickhouseCluster',
          'clinical',
          'cloud',
          'cloudant',
          'cloudfoundry',
          'cloudfront',
          'cloudrun',
          'clr',
          'cockroach',
          'cockroachDBCluster',
          'consul',
          'consulCluster',
          'container',
          'containerd',
          'containerregistry',
          'cosmos',
          'couchbase',
          'couchbaseCluster',
          'crio',
          'crowdstrikefalcon',
          'crystal',
          'data',
          'database',
          'databricks',
          'datafactory',
          'dataGrid',
          'datastore',
          'db2',
          'db2z',
          'dbaas',
          'dbtenant',
          'dcgm',
          'discovery',
          'docker',
          'documentdb',
          'domino',
          'drbd',
          'drbd.connection',
          'drbd.device',
          'drbd.name',
          'drbd.peerdevice',
          'drbd.resource',
          'dropwizard',
          'dynamodb',
          'ebs',
          'ec2',
          'ecs',
          'ecscontainer',
          'ecstask',
          'elastic',
          'elasticache',
          'elasticmapreduce',
          'elasticpool',
          'elasticsearch',
          'elasticsearchCluster',
          'elb',
          'emr',
          'endpoint',
          'entityStatistics',
          'envoy',
          'es',
          'esb',
          'esxi',
          'esxihost',
          'etcd',
          'eventstream',
          'f5',
          'fargate',
          'finagle',
          'function',
          'functionapp',
          'functions',
          'garden',
          'gce',
          'gcp',
          'gcp.cloudrun',
          'gcp.datastore',
          'gcp.pubsub',
          'gcp.sql',
          'gcp.storage',
          'genericZone',
          'glassfish',
          'go',
          'google',
          'hadoop',
          'hana',
          'haproxy',
          'haskell',
          'hazelcast',
          'hazelcastCluster',
          'hbase',
          'host',
          'hpmongodb',
          'hppostgresql',
          'httpd',
          'ibm',
          'IBM API Connect',
          'ibm.openstack',
          'ibm.openstack.region',
          'ibm.powervc',
          'ibm.powervc.region',
          'ibmApiConnect',
          'ibmApiConnect.catalog',
          'ibmApiConnect.organisation',
          'IBMAPIConnectSpace',
          'ibmcloud.clinicaldata',
          'ibmcloud.cloudant',
          'ibmcloud.cloudfoundry',
          'ibmcloud.containerregistry',
          'ibmcloud.elasticsearch',
          'ibmcloud.etcd',
          'ibmcloud.eventstream',
          'ibmcloud.functions',
          'ibmcloud.hpmongodb',
          'ibmcloud.hppostgresql',
          'ibmcloud.is-loadbalancer',
          'ibmcloud.loadbalancer',
          'ibmcloud.mongodb',
          'ibmcloud.postgresql',
          'ibmcloud.rabbitmq',
          'ibmcloud.redis',
          'ibmcloud.schematics',
          'ibmcloud.sqlquery',
          'ibmcloud.storage',
          'ibmcloud.vpn4vpc',
          'ibmcloud.vsi',
          'ibmDataPower.appliance',
          'ibmDataPower.cluster',
          'ibmDataPower.domain',
          'ibmDataPower.service',
          'ibmi.db2',
          'ibmi.os',
          'IBMInfosphere CDC',
          'ibmInfosphereCdc',
          'ibmInfosphereCdc.subscription',
          'ibmmq',
          'ibmmq.channel',
          'ibmmq.cluster',
          'ibmmq.listener',
          'ibmmq.mqttchannel',
          'ibmmq.qm',
          'ibmmq.queue',
          'ibmmqmft',
          'ibmmqmft.agent',
          'ibmmqmft.monitor',
          'ibmmqmft.queuemanager',
          'ibmmqmft.zone',
          'ibmopenstack',
          'ibmopenstack.computeinstance',
          'ibmopenstack.hypervisor',
          'ibmz.cics',
          'ibmz.ctg',
          'ibmz.db2',
          'ibmz.ims',
          'ibmz.os',
          'InstanaComponentMetrics',
          'instance',
          'iotcore',
          'java',
          'jboss',
          'jenkins',
          'jetty',
          'jira',
          'jvm',
          'kafka',
          'kafkaCluster',
          'kafkaConnectCluster',
          'kafkaConnectTask',
          'kafkaConnectWorker',
          'kafkaConnectWorkerConnector',
          'keyvault',
          'kinesis',
          'kong',
          'kubernetesCluster',
          'kubernetesCronJob',
          'kubernetesDaemonSet',
          'kubernetesDeployment',
          'kubernetesEndpoints',
          'kubernetesHorizontalPodAutoscaler',
          'kubernetesJob',
          'kubernetesNamespace',
          'kubernetesNode',
          'kubernetesPersistentVolume',
          'kubernetesPersistentVolumeClaim',
          'kubernetesPod',
          'kubernetesService',
          'kubernetesStatefulSet',
          'lambda',
          'liferay',
          'llm',
          'llmonitor',
          'load',
          'loadbalancer',
          'lxc',
          'machinelearning',
          'managedHSM',
          'management',
          'mariadb',
          'memcached',
          'mongodb',
          'mongoDbCluster',
          'mongoDbReplicaSet',
          'mq',
          'msiis',
          'mssql',
          'mule',
          'mysql',
          'neo4j',
          'netcore',
          'nginx',
          'node',
          'nodejs',
          'nodemanager',
          'nomad',
          'nova',
          'object',
          'opc',
          'openldap',
          'openshiftDeploymentConfig',
          'openstack',
          'OpenStack Compute Instance',
          'opentelemetry',
          'oracleDB',
          'otel',
          'oteldb',
          'oteldcgm',
          'otelhost',
          'oteljvm',
          'otelllmonitor',
          'otelprocess',
          'paas',
          'packet',
          'Packet Instance',
          'phmc',
          'phmc.console',
          'phmc.lpar',
          'phmc.sppool',
          'phmc.system',
          'phmc.vios',
          'php',
          'ping',
          'pingdirectory',
          'podman',
          'postgresql',
          'powervc',
          'powervc.computeinstance',
          'powervc.hypervisor',
          'process',
          'processgroup',
          'prometheus',
          'pubsub',
          'purview',
          'python',
          'queue',
          'rabbitmq',
          'rabbitMqCluster',
          'rds',
          'redis',
          'redisCluster',
          'redisEnterprise',
          'redisEnterpriseCluster',
          'redisEnterpriseDatabase',
          'redisEnterpriseShard',
          'region',
          'regions',
          'registry',
          'remotehost',
          'resourcemanager',
          'rocketmq.cluster',
          'rocketMq.topic',
          'ruby',
          's3',
          'sap',
          'sapabap',
          'sapapp',
          'sapdbinstance',
          'sapdbms',
          'sapdbtenant',
          'saphanasystem',
          'sapinstance',
          'sapsystem',
          'sapwebdispatcher',
          'scheduler',
          'schematics',
          'scripting',
          'selfMonitoring',
          'server',
          'service',
          'servicebus',
          'signalr',
          'sns',
          'solr',
          'solrCloudCluster',
          'spark',
          'springboot',
          'sql',
          'sqlquery',
          'sqs',
          'standalone',
          'statsd',
          'steadyMetrics',
          'storage',
          'stream',
          'subscription',
          'sybase',
          'syntheticpop',
          'tags',
          'tanzuFoundation',
          'tenantUnit',
          'tibcoas',
          'tibcoasdatagrid',
          'tibcobw',
          'tibcobw.appinst',
          'tibcobw.appnode',
          'tibcobw.process',
          'tibcoems',
          'timestream',
          'tomcat',
          'topic',
          'traefik',
          'tuxedo',
          'tuxedo.domain',
          'tuxedo.ipcqueue',
          'tuxedo.machine',
          'tuxedo.server',
          'tuxedoapp',
          'tuxedoApp',
          'tuxedoapp.application',
          'tuxedoapp.serviceBrokerProject',
          'tuxedoapp.tuxedoService',
          'varnish',
          'vault',
          'virtual',
          'volume',
          'vpc',
          'vpn',
          'vpn4vpc',
          'vsi',
          'vsphere',
          'vsphere.datacenter',
          'vsphere.esxihost',
          'vsphere.host',
          'vsphere.vm',
          'weblogic',
          'website.httpd',
          'websphere',
          'webspheredmgr',
          'webspheredmgr.dmgr',
          'websphereliberty',
          'yarn',
          'zhmc',
          'zhmc.console',
          'zhmc.cpc',
          'zookeeper'
        ]
      },
      {
        keyword: 'entity.springboot.name',
        description: 'SpringBoot Application name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.crowdstrike.falcon.version',
        description: 'The current version of the agent',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.phmc.console.name',
        description: 'pHMC console name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.websphereliberty.name',
        description: 'WebSphere liberty server name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.label',
        description: 'Label/name of entity',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.cloudrun.service.name',
        description: 'GCP Cloud Run Service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.horizontalpodautoscaler.name',
        description: 'Kubernetes HorizontalPodAutoscaler Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.prometheus.counter',
        description: 'Available Prometheus counter metrics',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.agent.logLevel',
        description: 'Agent log level',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.cluster.label',
        description: 'Kubernetes Cluster Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.dropwizard.timer',
        description: 'Available Dropwizard timers',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.cronjob.name',
        description: 'Kubernetes CronJob Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.storage.name',
        description: 'The name of the Storage service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.storage.name',
        description: 'Cloud Storage instance name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmz.cics.region',
        description: 'Region of CICS for z/OS',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmopenstack.hypervisor.name',
        description: 'IbmOpenstack Hypervisor name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmz.cics.systemid',
        description: 'System id of CICS for z/OS',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.openshift.deploymentconfig.uid',
        description: 'Openshift Deployment Config UID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.prometheus.gauge',
        description: 'Available Prometheus gauges',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.process.args',
        description: 'Process arguments',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.agent.gitops.commitMessage',
        description: 'Agent GitOps commit message',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.drbd.peerdevice.name',
        description: 'DRBD peer device name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.websphereliberty.version',
        description: 'WebSphere liberty version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ec2.amiId',
        description: 'AMI ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.lambda.runtime',
        description: 'AWS Lambda Runtime',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.sqlserver.name',
        description: 'The name of the SQL database server',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.cloudfoundry.organization.name',
        description: 'Cloud Foundry Organization name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.alicloud.rds.mysql',
        description: 'Apsara RDS MySQL',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.prometheus.unknown',
        description: 'Available Prometheus metrics with unknown type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.alicloud.rocketmq.group',
        description: 'AliCloud RocketMq Group',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.drbd.connection.name',
        description: 'DRBD connection',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.host.os.version',
        description: 'OS version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.websphere.version',
        description: 'WebSphere version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.daemonset.annotations',
        description: 'Annotations of Daemonset',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.cloudfront.id',
        description: 'CloudFront Distribution Id',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.msk.cluster.name',
        description: 'AWS MSK cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.persistentVolumeClaim.label',
        description: 'Labels of PersistentVolumeClaim',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.ecs.taskDefinitionVersionArn',
        description: 'AWS ECS Task Definition Version ARN',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.mq.engineVersion',
        description: 'Amazon MQ engine version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.alicloud.rocketmq.groupId',
        description: 'AliCloud RocketMq Group ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.host.cpu.count',
        description: 'Number of CPUs',
        context: 'entities',
        termType: 'long',
        fixedValues: []
      },
      {
        keyword: 'entity.python.app.name',
        description: 'Python app name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.documentdb.clusterName',
        description: 'Amazon DocumentDB Cluster Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.go.version',
        description: 'Go runtime version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.host.gpu.count',
        description: 'Number of GPUs',
        context: 'entities',
        termType: 'long',
        fixedValues: []
      },
      {
        keyword: 'entity.openshift.deploymentconfig.namespace',
        description: 'Openshift DeploymentConfig Namespace',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.redshift.nodeType',
        description: 'Amazon Redshift Node Type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.beanstalk.version',
        description: 'Beanstalk version label',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.deployment.name',
        description: 'Kubernetes Deployment Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.host.os.name',
        description: 'OS name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.nodejs.keyword',
        description: 'Keywords',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.containerd.containerId',
        description: 'ID of the containerd container',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.crio.image',
        description: 'Name of the CRI-O image',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jboss.servlet',
        description: 'Servlets',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmz.ims.imsid',
        description: 'IMS id of IMS for z/OS',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.documentdb.instance.identifier',
        description: 'AWS Redshift Node ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tibcoems.topic.name',
        description: 'Name of the topic',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.replicaSet.name',
        description: 'Kubernetes Replica Set Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.daemonset.name',
        description: 'Kubernetes DaemonSet Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmdatapower.domain.name',
        description: 'IBM DataPower domain name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.pingdirectory.master',
        description: 'Server is master',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.phmc.spp.name',
        description: 'pHMC SPPool name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.channel.name',
        description: 'IBM MQ channel name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.nginx.version',
        description: 'Nginx version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.beanstalk.health',
        description: 'Beanstalk health status',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.syntheticpop.version',
        description: 'Synthetic PoP chart version, e.g. 1.0.16',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kafkaconnect.cluster.name',
        description: 'Kafka Connect Cluster Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.prometheus.untyped',
        description: 'Available Prometheus untyped metrics',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.ebs.state',
        description: 'Volume State',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.location',
        description: 'Resource location',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.biztalk.group',
        description: 'BizTalk server group',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.cronjob.label',
        description: 'Labels of Cronjob',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.ipcqueue.queueId',
        description: 'IPC queue id',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.version',
        description: 'JVM version, e.g. 1.8.0_102',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmqmft.queuemanager.name',
        description: 'IBM MQ Managed File Transfer Coordination Queue Manager Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.db2.name',
        description: 'db2 database name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.remote.host.fqdn',
        description: 'Fully qualified domain name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ace.messageFlow.name',
        description: 'ACE Message Flow Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.drbd.device.name',
        description: 'DRBD device name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tomcat.webapp',
        description: 'Web applications',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.servicebus.name',
        description: 'Azure service bus namespace name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.agent.bootVersion',
        description: 'Agent boot version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.agent.startType',
        description: 'Agent Start Type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.prometheus.gauge',
        description: 'Available Prometheus gauge metrics',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.ipcqueue.senderSrv',
        description: 'Sender server name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.service.id',
        description: 'The ID of the service',
        context: 'services',
        termType: 'id',
        fixedValues: []
      },
      {
        keyword: 'entity.tibcoas.node.name',
        description: 'Tibco ActiveSpaces node name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmdatapower.appliance.status',
        description: 'IBM DataPower appliance status',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kafka.cluster.name',
        description: 'Kafka cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.apigateway.apiName',
        description: 'ApiGateway Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.dropwizard.histogram',
        description: 'Available Dropwizard histograms',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jboss.nodeName',
        description: 'JBoss Node Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jboss.deployment',
        description: 'Deployments',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.webspheredmgr.dmgr.version',
        description: 'WebSphere deployment manager version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.alicloud.rds.mysql.instanceName',
        description: 'Apsara RDS MySQL Instance Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmApiConnect.catalog.name',
        description: 'ibmApiConnect catalog name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.redis.cluster.name',
        description: 'Redis cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.nomad.taskName',
        description: 'Name of the nomad task',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.postgresql.name',
        description: 'The name of the PostgreSQL service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.agent.origin',
        description: 'Agent origin',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.pubsub.topic.name',
        description: 'Google Cloud PubSub topic name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.databricks.name',
        description: 'The name of the Databricks service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.syntheticpop.tenantType',
        description: 'Synthetic PoP tenant type, Single or Multi',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.alicloud.oss.bucket',
        description: 'AliCloud OSS Bucket',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmqmft.agent.name',
        description: 'IBM MQ Managed File Transfer Agent Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.pingdirectory.unsynchronized',
        description: 'Server is out of sync',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.machine.role',
        description: 'The role of Tuxedo machine',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmi.os.hostname',
        description: 'Hostname of your IBM i instance',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ec2.publicName',
        description: 'Public hostname',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ace.integrationServer.state',
        description: 'ACE integrationServer state',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.daemonset.uid',
        description: 'Kubernetes DaemonSet UID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.cloudfoundry.application.name',
        description: 'Cloud Foundry Application name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.rocketmq.topic.name',
        description: 'RocketMQ topic name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.crowdstrike.falcon.aid',
        description: 'The agent identifier',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'event.source',
        description: 'Event source',
        context: 'events',
        termType: 'string',
        fixedValues: ['application', 'endpoint', 'infra', 'service', 'website']
      },
      {
        keyword: 'entity.remote.host.os.arch',
        description: 'Architecture',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.powervc.name',
        description: 'PowerVC name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.netcore.app.dependency',
        description: 'Application dependencies and versions in the form module@version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.websphere.nodeName',
        description: 'WebSphere node name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.server.name',
        description: 'Tuxedo server name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.host.cpu.model',
        description: 'CPU Model',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.ipcqueue.senderPID',
        description: 'Process identifier of the last process that wrote to the queue',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.domain.id',
        description: 'Oracle Tuxedo domain ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.horizontalpodautoscaler.uid',
        description: 'Kubernetes HorizontalPodAutoscaler UID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.machine.state',
        description: 'The state of Tuxedo machine',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.phmc.lpar.name',
        description: 'pHMC LPAR name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.statefulset.name',
        description: 'Kubernetes StatefulSet Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.endpoint.name',
        description: 'the name of the endpoint',
        context: 'endpoints',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.host.name',
        description: 'Host name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.qm.version',
        description: 'IBM MQ queue manager version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.rds.id',
        description: 'Database Instance Identifier',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.host.ip',
        description: 'IP address, either IPv4 or IPv6',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.cronjob.uid',
        description: 'Kubernetes CronJob UID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.crystal.args',
        description: 'Crystal execution arguments',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.service.uid',
        description: 'Kubernetes Service UID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.job.name',
        description: 'Kubernetes Job Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.ecs.image',
        description: 'Name of the ECS Docker image',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.agent.gitops.remoteBranch',
        description: 'Agent GitOps remote branch',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.crio.label',
        description: 'Labels of the CRI-O container',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.resourcegroup',
        description: 'The resource group of the resource',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.process.exec',
        description: 'Process executable',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ec2.ipv4',
        description: 'IP V4',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmz.db2.mvssystem',
        description: 'Multiple Virtual Storage system name of Db2 for z/OS',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.node.annotation',
        description: 'Annotations of Node',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.machine.lmid',
        description: 'Tuxedo machine logical identifier',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.clr.version',
        description: 'CLR runtime version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibm.openstack.name',
        description: 'IBM openstack name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.pod.phase',
        description: 'Kubernetes Pod Status',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.keyvault.name',
        description: 'The name of the Keyvault service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.name',
        description: 'Instance / Resource name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.redisenterprise.version',
        description: 'Redis Enterprise Version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'event.specification.id',
        description: 'Event specification ID',
        context: 'events',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.host.memory',
        description: 'Available memory',
        context: 'entities',
        termType: 'long',
        fixedValues: []
      },
      {
        keyword: 'entity.tibcobw.process.name',
        description: 'Process Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.clr.app.name',
        description: 'CLR app name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.otelhost.name',
        description: 'Name of the OpenTelemetry Host',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.clickhouse.cluster.name',
        description: 'Clickhouse cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.ecs.containerName',
        description: 'Names of the ECS container',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.storage.id',
        description: 'Cloud Storage instance ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ping.type',
        description: 'Ping type',
        context: 'entities',
        termType: 'string',
        fixedValues: ['http', 'icmp']
      },
      {
        keyword: 'entity.kubernetes.pod.uid',
        description: 'Kubernetes Pod UID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.couchbase.cluster.name',
        description: 'Couchbase cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.cluster.name',
        description: 'IBM MQ cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.nodejs.app.name',
        description: 'Application name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.lambda.version',
        description: 'AWS Lambda Version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.agent.vm.version',
        description: 'Agent VM Version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.managedHSM.name',
        description: 'The name of the Managed HSM service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.haskell.programName',
        description: 'Program Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.host.os.arch',
        description: 'Architecture',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.persistentVolume.storageClassName',
        description: 'Kubernetes PersistentVolume StorageClass Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.rediscache.name',
        description: 'The name of the Redis Cache service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.prometheus.gaugehistogram',
        description: 'Available Prometheus gauge histogram metrics',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.queue.type',
        description: 'IBM MQ queue type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.elasticsearch.cluster.name',
        description: 'Elasticsearch cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.beanstalk.environment',
        description: 'Beanstalk environment name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tibcoas.grid.name',
        description: 'Tibco ActiveSpaces data grid name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmApiConnect.org.name',
        description: 'ibmApiConnect organisation name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.cloudfront.domainName',
        description: 'CloudFront Distribution Domain Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kafkaconnect.task.name',
        description: 'Kafka Connect Task name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.lxc.state',
        description: 'LXC container state',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.remote.host.cpu.model',
        description: 'CPU Model',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.sql.tier',
        description: 'Cloud SQL instance tier',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.functionapp.name',
        description: 'The name of the Function APP',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.podman.containerId',
        description: 'ID of the Podman container',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.nomad.allocName',
        description: 'Name of the nomad allocation',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.opc.type',
        description: 'Instance type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.cosmosdb.kind',
        description: 'The kind of the Cosmos DB service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.app.version',
        description: 'Application version as defined in the MANIFEST file',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.crystal.app.dependency',
        description: 'Application dependencies and versions in the form gem@version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.otel.sum',
        description: 'OpenTelemetry Sums',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.websphere.serverName',
        description: 'WebSphere server name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.micrometer.longTaskTimer',
        description: 'Available Micrometer long task timers',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.horizontalpodautoscaler.label',
        description: 'Labels of HorizontalPodAutoscaler',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.host.mac',
        description: 'MAC addresses',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.type',
        description: 'Instance / Resource type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.cosmosdb.name',
        description: 'The name of the Cosmos DB Service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.prometheus.summary',
        description: 'Available Prometheus summaries',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmdatapower.cluster.name',
        description: 'IBM DataPower cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.node.internalIp',
        description: 'Kubernetes Node Internal IP',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.ecs.taskDefinitionVersion',
        description: 'AWS ECS Task Definition Version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.remote.host.os.version',
        description: 'OS version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.horizontalpodautoscaler.annotation',
        description: 'Annotations of HorizontalPodAutoscaler',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.rocketmq.cluster.name',
        description: 'RocketMQ cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.dropwizard.gauge',
        description: 'Available Dropwizard gauges',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.iotcore.endpoint',
        description: 'IoT Core endpoint',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ping.target',
        description: 'Ping target',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.lxc.name',
        description: 'LXC container name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.namespace',
        description: 'Kubernetes namespace name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ruby.app.name',
        description: 'Ruby app name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.podman.name',
        description: 'Name of the Podman container',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.statefulset.annotation',
        description: 'Annotations of StatefulSet',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.finagle.counters',
        description: 'Finagle Counters',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tibcobw.process.appname',
        description: 'Application Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.persistentVolume.label',
        description: 'Labels of PersistentVolume',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.pod.annotation',
        description: 'Annotations of Pod',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.gce.instanceId',
        description: 'Instance ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.pod.name',
        description: 'Kubernetes Pod Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.remote.host.ip',
        description: 'IP address, either IPv4 or IPv6',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.garden.containerId',
        description: 'ID of the garden container',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.host.fqdn',
        description: 'Fully qualified domain name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.datastore.projectNumber',
        description: 'Google Cloud Datastore Project Number',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'event.entity.label',
        description: 'Entity label',
        context: 'events',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.subscription',
        description: 'The subscription ID of the resource',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.prometheus.counter',
        description: 'Available Prometheus counters',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.webspheredmgr.dmgr.serverName',
        description: 'WebSphere deployment manager server name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.dropwizard.timer',
        description: 'Available Dropwizard timers',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedoapp.application.name',
        description: 'Tuxedo Application Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.service.name',
        description: 'The name of the service',
        context: 'services',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.cassandra.cluster.name',
        description: 'Cassandra cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.qm.activeNode',
        description: 'The hostname of the IBM MQ queue manager running node',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ace.integrationNode.name',
        description: 'ACE Integration Node Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.timestream.databaseName',
        description: 'Timestream Database Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.mongodb.atlas.cluster.name',
        description: 'MongoDB Atlas cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kafkaconnect.connector.name',
        description: 'Kafka Connect Worker Connector name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ceph.cluster.name',
        description: 'Ceph cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmi.db2.hostname',
        description: 'Hostname of your IBM i Series instance where Db2 is running',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.syntheticpop.locationName',
        description: 'Synthetic PoP location name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.arn',
        description: 'Amazon Resource Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.ipcqueue.receiverSrv',
        description: 'Receiver server name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.server.groupName',
        description: 'The group number of the Tuxedo server',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.pubsub.subscription.name',
        description: 'Google Cloud PubSub subscription name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.crio.containerId',
        description: 'ID of the CRI-O container',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.remote.host.source',
        description: 'Source',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.namespace.annotation',
        description: 'Annotations of Namespace',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.clr.target',
        description: '.Net Framework target version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tibcobw.process.modulename',
        description: 'Module Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.servicebus.topic.name',
        description: 'Azure ServiceBus topic name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.nodejs.app.version',
        description: 'Application version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.ipcqueue.receiverPID',
        description: 'Process identifier of the last process that read from the queue',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.lxc.ip',
        description: 'LXC container IP',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.elasticsearch.index',
        description: 'Available indices',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.websphere.cellName',
        description: 'Websphere cell name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.statefulset.uid',
        description: 'Kubernetes StatefulSet UID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.msk.instanceType',
        description: 'Amazon MSK Broker instance type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.classpath',
        description: 'Classpath',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.msk.broker.id',
        description: 'AWS MSK Broker ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.server.id',
        description: 'Tuxedo server ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.lxc.privileged',
        description: 'LXC container is privileged',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tibcobw.appnode.domainname',
        description: 'Tibco BW domain name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.msk.clusterName',
        description: 'Amazon MSK cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.node.hostname',
        description: 'Kubernetes Node Hostname',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ec2.type',
        description: 'EC2 instance type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.storage.queue.name',
        description: 'Azure Queue name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.dropwizard.histogram',
        description: 'Available Dropwizard histograms',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.elasticsearch.version',
        description: 'Version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.type',
        description: 'Type of entity or type of an entity directly related to it',
        context: 'entities',
        termType: 'string',
        fixedValues: [
          'ace.integrationNode',
          'ace.integrationServer',
          'ace.messageFlow',
          'activemq',
          'activemqartemis',
          'agent',
          'alicloud',
          'alicloud.oss',
          'alicloud.oss.bucket',
          'alicloud.rds',
          'alicloud.rds.mysql',
          'alicloud.rocketmq',
          'alicloud.rocketmq.group',
          'alicloud.rocketmq.instance',
          'alicloud.rocketmq.topic',
          'annotator',
          'api',
          'ApiGateway',
          'apigateway',
          'application',
          'appservice',
          'appsync',
          'autoscaling',
          'availabilityZone',
          'aws',
          'aws.apigateway',
          'aws.appsync',
          'aws.autoscaling',
          'aws.beanstalk',
          'aws.cloudfront',
          'aws.documentdb',
          'aws.dynamodb',
          'aws.ebs',
          'aws.ec',
          'aws.ecs.ecscontainer',
          'aws.ecs.ecstask',
          'aws.elb',
          'aws.emr',
          'aws.es',
          'aws.iotcore',
          'aws.kinesis',
          'aws.lambda.function',
          'aws.mq',
          'aws.msk',
          'aws.rds',
          'aws.redshift',
          'aws.s3',
          'aws.sns',
          'aws.sqs',
          'aws.timestream',
          'azure',
          'azure.storage',
          'azure.storage.blob',
          'azure.storage.queue',
          'balancer',
          'beanstalk',
          'beeinstana',
          'biztalk',
          'broker',
          'cache',
          'cassandra',
          'cassandraCluster',
          'ceph',
          'cfApplication',
          'cfOrganization',
          'cfSpace',
          'clickhouse',
          'clickhouseCluster',
          'clinical',
          'cloud',
          'cloudant',
          'cloudfoundry',
          'cloudfront',
          'cloudrun',
          'clr',
          'cockroach',
          'cockroachDBCluster',
          'consul',
          'consulCluster',
          'container',
          'containerd',
          'containerregistry',
          'cosmos',
          'couchbase',
          'couchbaseCluster',
          'crio',
          'crowdstrikefalcon',
          'crystal',
          'data',
          'database',
          'databricks',
          'datafactory',
          'dataGrid',
          'datastore',
          'db2',
          'db2z',
          'dbaas',
          'dbtenant',
          'dcgm',
          'discovery',
          'docker',
          'documentdb',
          'domino',
          'drbd',
          'drbd.connection',
          'drbd.device',
          'drbd.name',
          'drbd.peerdevice',
          'drbd.resource',
          'dropwizard',
          'dynamodb',
          'ebs',
          'ec2',
          'ecs',
          'ecscontainer',
          'ecstask',
          'elastic',
          'elasticache',
          'elasticmapreduce',
          'elasticpool',
          'elasticsearch',
          'elasticsearchCluster',
          'elb',
          'emr',
          'endpoint',
          'envoy',
          'es',
          'esb',
          'esxi',
          'esxihost',
          'etcd',
          'eventstream',
          'f5',
          'fargate',
          'finagle',
          'function',
          'functionapp',
          'functions',
          'garden',
          'gce',
          'gcp',
          'gcp.cloudrun',
          'gcp.datastore',
          'gcp.pubsub',
          'gcp.sql',
          'gcp.storage',
          'genericZone',
          'glassfish',
          'go',
          'google',
          'hadoop',
          'hana',
          'haproxy',
          'haskell',
          'hazelcast',
          'hazelcastCluster',
          'hbase',
          'host',
          'hpmongodb',
          'hppostgresql',
          'httpd',
          'ibm',
          'IBM API Connect',
          'ibm.openstack',
          'ibm.openstack.region',
          'ibm.powervc',
          'ibm.powervc.region',
          'ibmApiConnect',
          'ibmApiConnect.catalog',
          'ibmApiConnect.organisation',
          'IBMAPIConnectSpace',
          'ibmcloud.clinicaldata',
          'ibmcloud.cloudant',
          'ibmcloud.cloudfoundry',
          'ibmcloud.containerregistry',
          'ibmcloud.elasticsearch',
          'ibmcloud.etcd',
          'ibmcloud.eventstream',
          'ibmcloud.functions',
          'ibmcloud.hpmongodb',
          'ibmcloud.hppostgresql',
          'ibmcloud.is-loadbalancer',
          'ibmcloud.loadbalancer',
          'ibmcloud.mongodb',
          'ibmcloud.postgresql',
          'ibmcloud.rabbitmq',
          'ibmcloud.redis',
          'ibmcloud.schematics',
          'ibmcloud.sqlquery',
          'ibmcloud.storage',
          'ibmcloud.vpn4vpc',
          'ibmcloud.vsi',
          'ibmDataPower.appliance',
          'ibmDataPower.cluster',
          'ibmDataPower.domain',
          'ibmDataPower.service',
          'ibmi.db2',
          'ibmi.os',
          'IBMInfosphere CDC',
          'ibmInfosphereCdc',
          'ibmInfosphereCdc.subscription',
          'ibmmq',
          'ibmmq.channel',
          'ibmmq.cluster',
          'ibmmq.listener',
          'ibmmq.mqttchannel',
          'ibmmq.qm',
          'ibmmq.queue',
          'ibmmqmft',
          'ibmmqmft.agent',
          'ibmmqmft.monitor',
          'ibmmqmft.queuemanager',
          'ibmmqmft.zone',
          'ibmopenstack',
          'ibmopenstack.computeinstance',
          'ibmopenstack.hypervisor',
          'ibmz.cics',
          'ibmz.ctg',
          'ibmz.db2',
          'ibmz.ims',
          'ibmz.os',
          'InstanaComponentMetrics',
          'instance',
          'iotcore',
          'java',
          'jboss',
          'jenkins',
          'jetty',
          'jira',
          'jvm',
          'kafka',
          'kafkaCluster',
          'kafkaConnectCluster',
          'kafkaConnectTask',
          'kafkaConnectWorker',
          'kafkaConnectWorkerConnector',
          'keyvault',
          'kinesis',
          'kong',
          'kubernetesCluster',
          'kubernetesCronJob',
          'kubernetesDaemonSet',
          'kubernetesDeployment',
          'kubernetesEndpoints',
          'kubernetesHorizontalPodAutoscaler',
          'kubernetesJob',
          'kubernetesNamespace',
          'kubernetesNode',
          'kubernetesPersistentVolume',
          'kubernetesPersistentVolumeClaim',
          'kubernetesPod',
          'kubernetesService',
          'kubernetesStatefulSet',
          'lambda',
          'liferay',
          'llm',
          'llmonitor',
          'load',
          'loadbalancer',
          'lxc',
          'machinelearning',
          'managedHSM',
          'management',
          'mariadb',
          'memcached',
          'mongodb',
          'mongoDbCluster',
          'mongoDbReplicaSet',
          'mq',
          'msiis',
          'mssql',
          'mule',
          'mysql',
          'neo4j',
          'netcore',
          'nginx',
          'node',
          'nodejs',
          'nodemanager',
          'nomad',
          'nova',
          'object',
          'opc',
          'openldap',
          'openshiftDeploymentConfig',
          'openstack',
          'OpenStack Compute Instance',
          'opentelemetry',
          'oracleDB',
          'otel',
          'oteldb',
          'oteldcgm',
          'otelhost',
          'oteljvm',
          'otelllmonitor',
          'otelprocess',
          'paas',
          'packet',
          'Packet Instance',
          'phmc',
          'phmc.console',
          'phmc.lpar',
          'phmc.sppool',
          'phmc.system',
          'phmc.vios',
          'php',
          'ping',
          'pingdirectory',
          'podman',
          'postgresql',
          'powervc',
          'powervc.computeinstance',
          'powervc.hypervisor',
          'process',
          'processgroup',
          'prometheus',
          'pubsub',
          'purview',
          'python',
          'queue',
          'rabbitmq',
          'rabbitMqCluster',
          'rds',
          'redis',
          'redisCluster',
          'redisEnterprise',
          'redisEnterpriseCluster',
          'redisEnterpriseDatabase',
          'redisEnterpriseShard',
          'regions',
          'registry',
          'remotehost',
          'resourcemanager',
          'rocketmq.cluster',
          'rocketMq.topic',
          'ruby',
          's3',
          'sap',
          'sapabap',
          'sapapp',
          'sapdbinstance',
          'sapdbms',
          'sapdbtenant',
          'saphanasystem',
          'sapinstance',
          'sapsystem',
          'sapwebdispatcher',
          'scheduler',
          'schematics',
          'scripting',
          'server',
          'service',
          'servicebus',
          'signalr',
          'sns',
          'solr',
          'solrCloudCluster',
          'spark',
          'springboot',
          'sql',
          'sqlquery',
          'sqs',
          'standalone',
          'statsd',
          'storage',
          'stream',
          'subscription',
          'sybase',
          'syntheticpop',
          'tags',
          'tanzuFoundation',
          'tibcoas',
          'tibcoasdatagrid',
          'tibcobw',
          'tibcobw.appinst',
          'tibcobw.appnode',
          'tibcobw.process',
          'tibcoems',
          'timestream',
          'tomcat',
          'topic',
          'traefik',
          'tuxedo',
          'tuxedo.domain',
          'tuxedo.ipcqueue',
          'tuxedo.machine',
          'tuxedo.server',
          'tuxedoapp',
          'tuxedoApp',
          'tuxedoapp.application',
          'tuxedoapp.serviceBrokerProject',
          'tuxedoapp.tuxedoService',
          'varnish',
          'vault',
          'virtual',
          'volume',
          'vpc',
          'vpn',
          'vpn4vpc',
          'vsi',
          'vsphere',
          'vsphere.datacenter',
          'vsphere.esxihost',
          'vsphere.host',
          'vsphere.vm',
          'weblogic',
          'website.httpd',
          'websphere',
          'webspheredmgr',
          'webspheredmgr.dmgr',
          'websphereliberty',
          'yarn',
          'zhmc',
          'zhmc.console',
          'zhmc.cpc',
          'zookeeper'
        ]
      },
      {
        keyword: 'entity.agent.gitops.commitHash',
        description: 'Agent GitOps commit hash',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.ebs.mountedInstanceId',
        description: 'Mounted Instance ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.pubsub.projectNumber',
        description: 'Google Cloud PubSub Project Number',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.crowdstrike.falcon.rmfState',
        description: 'Whether the agent currently in a reduced functionality mode',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.elasticsearch.type',
        description: 'Elasticsearch node type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.nodejs.app.dependency',
        description: 'Application dependencies and versions in the form module@version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.alicloud.oss',
        description: 'AliCloud OSS',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.otel.gauge',
        description: 'OpenTelemetry Gauges',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.micrometer.distributionSummary',
        description: 'Available Micrometer distribution summaries',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.sqlelasticpool.name',
        description: 'The name of the SQL elastic pool',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'selfMonitoring.component',
        description: 'Component name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.containerd.image',
        description: 'Name of the containerd image',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.python.version',
        description: 'Python runtime version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.ebs.type',
        description: 'Volume Type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.queue.description',
        description: 'IBM MQ queue description',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmi.db2.collectionServicesLibraryName',
        description: 'The library name which is used for Collection Services',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.agent.updateMode',
        description: 'Agent update mode',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ec2.securityGroups',
        description: 'Security Groups',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.crio.name',
        description: 'Name of the CRI-O container',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.machine.pmid',
        description: 'Tuxedo machine physical identifier',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.storage.kind',
        description: 'The kind of the Storage service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmz.ims.imsplexname',
        description: 'IMSplexName of IMS for z/OS',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jboss.connector',
        description: 'Connectors',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.replicationcontroller.name',
        description: 'Kubernetes Replication Controller Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.node.externalIp',
        description: 'Kubernetes Node External IP',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.pubsub.projectId',
        description: 'Google Cloud PubSub Project ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmz.ctg.origin_node',
        description: 'origin_node of CTG for z/OS',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.node.name',
        description: 'Kubernetes Node Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.redshift.cluster.name',
        description: 'AWS Redshift cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.marathon.appId',
        description: 'Marathon application ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ruby.execArgs',
        description: 'Ruby execution arguments',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.redshift.clusterName',
        description: 'Amazon Redshift Cluster Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.openshift.deploymentconfig.label',
        description: 'Labels of DeploymentConfig',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.beanstalk.application',
        description: 'Beanstalk application name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.job.uid',
        description: 'Kubernetes Job UID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.pingdirectory.state',
        description: 'State of the server',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.deployment.uid',
        description: 'Kubernetes Deployment UID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.deployment.annotation',
        description: 'Annotations of Deployment',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmqmft.monitor.name',
        description: 'IBM MQ Managed File Transfer Monitor Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.redisenterprise.cluster.name',
        description: 'Redis Enterprise cluster name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tuxedo.server.groupNo',
        description: 'The group number of the Tuxedo server',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.dropwizard.meter',
        description: 'Available Dropwizard meters',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.storage.location',
        description: 'Cloud Storage location',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.prometheus.histogram',
        description: 'Available Prometheus histograms',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gcp.cloudrun.service.revision',
        description: 'GCP Cloud Run Revision',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.php.version',
        description: 'PHP version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.websphere.ejbModules',
        description: 'Deployed EJB modules',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.mqttchannel.name',
        description: 'IBM MQ MQTT channel name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ace.messageFlow.type',
        description: 'ACE Message Flow Type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmInfosphereCdc.subscription.name',
        description: 'ibm Infosphere CDC subscription name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.queue.usage',
        description: 'IBM MQ queue usage',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibmmq.qm.platform',
        description: 'IBM MQ queue manager platform',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.docker.containerId',
        description: 'ID of the docker container',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.deployment.label',
        description: 'Labels of Deployment',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.rds.name',
        description: 'Database Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.agent.capability',
        description: 'Agent capability',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.storage.blobCapabilities',
        description: 'Blob Storage or ADLS Gen2',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.cluster.uuid',
        description: 'Kubernetes Cluster UUID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.apim.name',
        description: 'The name of the API Management service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.vsphere.datacenter.version',
        description: 'vSphere datacenter version',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.mq.instanceType',
        description: 'Amazon MQ instance type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.physical.reference.id',
        description: 'Physical reference ID of the entity',
        context: 'entities',
        termType: 'id',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.daemonset.label',
        description: 'Labels of Daemonset',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.phmc.system.name',
        description: 'pHMC System name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.mysql.name',
        description: 'The name of the MySQL server',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.docker.image',
        description: 'Name of the docker image',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.gce.type',
        description: 'Instance type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.agent.mode',
        description: 'Agent mode (disabled / infrastructure / apm)',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.process.id',
        description: 'Process ID',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tag',
        description: 'Tags',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.remote.host.cpu.count',
        description: 'Number of CPUs',
        context: 'entities',
        termType: 'long',
        fixedValues: []
      },
      {
        keyword: 'entity.rocketmq.broker.name',
        description: 'RocketMQ broker name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.tibcobw.appnode.appnodename',
        description: 'The name of AppNode',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.docker.label',
        description: 'Labels of the Docker container',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.signalr.name',
        description: 'The name of the SignalR service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.s3.bucketName',
        description: 'Amazon Resource Name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.mq.deploymentMode',
        description: 'Amazon MQ deployment mode',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.jvm.args',
        description: 'JVM arguments, e.g. -Xmx512m',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.webspheredmgr.dmgr.cellName',
        description: 'Websphere deployment manager cell name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.ibm.openstack.region.name',
        description: 'IBM Openstack Region name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.kubernetes.pod.label',
        description: 'Labels of Pod',
        context: 'entities',
        termType: 'key_value',
        fixedValues: []
      },
      {
        keyword: 'entity.aws.elb.type',
        description: 'Elb Type',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.powervc.computeinstance.name',
        description: 'PowerVC Compute Instance name',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      },
      {
        keyword: 'entity.azure.service.loadbalancer.name',
        description: 'The name of the LoadBalancer service',
        context: 'entities',
        termType: 'string',
        fixedValues: []
      }
    ]
  },
  config: {
    featureFlags,
    tenant: 'instana',
    tenantUnit: 'test',
    environment: 'internal'
  },
  build: {
    revision: '85373525d145604cda61cf7544d376436c5c49d5',
    date: '2019-01-28T09:03:31.258Z',
    tag: '1.0.0'
  },
  termsAndPrivacySettings: {}
};
