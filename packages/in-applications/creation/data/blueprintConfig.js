export const blueprintConfig = Object.freeze([
  {
    type: 'servicesEndpoints',
    name: 'Services & Endpoints',
    headline: 'Services & Endpoints',
    text: 'Create an Application Perspective with focus on Services and Endpoints',
    htmlContent: `
    <p><b>What is this for?</b></br>
    Sometimes it is easiest to create a perspective by specifying the services or endpoints directly.  This can also be done using string operators like “contains”, “starts with”, etc.
    </br> </br>
    <b>Who uses this a lot?</b></br>
    DevOps, Operations, SRE, Developer, QA, support, Business owner, Architect
    </p>
      `,
    curatedTagFilters: []
  },
  {
    type: 'container',
    name: 'Container:  K8s or related. ',
    headline: 'Container:  K8s or related.',
    text: 'Create a perspective for containers with inter-dependencies to monitor them as a group in a perspective.',
    htmlContent: `
      <p>The simplest way is to use the container name, or other Docker meta-data, to create a group.  Kubernetes has many different ways of grouping containers, such as node, deployment, or namespace, which are all supported.  Other orchestration tools  like cloud foundry, openshift, marathon, etc. have their own meta-data tat can be used.</p>
      `,
    curatedTagFilters: [
      {
        category: 'Docker',
        tags: ['container.name', 'container.image.name', 'docker.compose.service', 'docker.image.name', 'docker.label']
      },
      {
        category: 'General Kubernetes',
        tags: [
          'kubernetes.container.name',
          'kubernetes.deployment.namespace',
          'kubernetes.deployment.label',
          'kubernetes.namespace',
          'kubernetes.node.name',
          'kubernetes.pod.label',
          'kubernetes.pod.name',
          'kubernetes.pod.namespace',
          'kubernetes.replicaset.namespace',
          'kubernetes.replicationcontroller.namespace',
          'kubernetes.service.name',
          'kubernetes.service.namespace'
        ]
      },
      {
        category: 'Orchestration',
        tags: [
          'cloudfoundry.app.name',
          'cloudfoundry.organization.name',
          'openshift.deploymentconfig.label',
          'openshift.deploymentconfig.name',
          'openshift.deploymentconfig.namespace',
          'marathon.app.id',
          'marathon.label',
          'nomad.job.name'
        ]
      }
    ]
  },
  {
    type: 'location',
    name: 'Location: env, geo or host.',
    headline: 'Location: env, geo or host.',
    text:
      'Infrastructure has dependencies between them so monitor them as a group of related services in an infrastructure perspective.  This is done at different levels of scale.',
    htmlContent: `
      <p>The largest scope is by cloud or cloud specific information such as cluster, zone, or cloud provider. This can be shrunk to a zone. Lastly all the services running on a host can be grouped.</p>
      `,
    curatedTagFilters: [
      {
        category: 'Zone',
        tags: ['agent.zone', 'aws.ec2.zone', 'azure.zone', 'cloudfoundry.space.name']
      },
      {
        category: 'Cloud',
        tags: [
          'aws.arn',
          'aws.ec2.ipv4',
          'aws.ec2.publicName',
          'aws.ec2.tag',
          'aws.ec2.zone',
          'aws.ecs.cluster.name',
          'aws.ec2.zone',
          'azure.zone',
          'cloud.provider'
        ]
      },
      {
        category: 'Host',
        tags: [
          'call.http.host',
          'host.fqdn',
          'host.ip',
          'host.name',
          'host.zone',
          'jboss.node.name',
          'kubernetes.cluster.name',
          'kubernetes.node.name'
        ]
      }
    ]
  }
]);
