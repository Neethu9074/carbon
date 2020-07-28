export const blueprintConfig = Object.freeze([
  {
    type: 'servicesEndpoints',
    name: 'Services & Endpoints',
    headline: 'Services & Endpoints',
    description: [
      {
        headline: 'What is this for?',
        htmlContent: `Sometimes it is easiest to create a perspective by specifying the services or endpoints directly.  This can also be done using string operators like “contains”, “starts with”, etc.`
      },
      {
        headline: 'Who uses this a lot?',
        htmlContent: 'DevOps, Operations, SRE, Developer, QA, support, Business owner, Architect'
      }
    ],
    curatedTagFilters: []
  },
  {
    type: 'container',
    name: 'Container:  K8s or related. ',
    headline: 'Container:  K8s or related.',
    description: [
      {
        headline: 'What is this for?',
        htmlContent: `When you want to group services based on:
        <ul><li>Namespace (this is frequently used)</li>
        <li>Container or image name</li>
        <li>Platform related service names</li>
        <li>Deployment information</li>
        <li>Labels</li>
        </ul>
        Tags are available for:  Kubernetes, OpenShift, Docker, Cloud Foundry, Marathon, and Nomad.`
      },
      { headline: 'Who uses this a lot?', htmlContent: `SRE, operations, DevOps` },
      {
        headline: 'Some tips for using.',
        htmlContent: `Environments can be distinguished by combining this with a location (e.g., agent.zone) or cluster (kubernetes.cluster.name) to distinguish environments.
        If you will use this for troubleshooting then you want to see the end-to-end flow.  Please set downstream service to ON and choose Inbound Calls..
        Click on “All Filters” if you don’t see the tag you want.`
      }
    ],
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
    description: [
      { headline: '', htmlContent: `` },
      {
        headline: 'What is this for?',
        htmlContent: ` When you want to group services based on information about an environment that
        may be big (e.g., cloud zone) or small (e.g. host). It also has zone
        identifiers. It can be added to a query to distinguish between different
        environments. Group services together based on information about their
        location. The largest scope is cloud or cloud specific information such as
        cluster, zone, or cloud provider. Next is a zone. All the services running on
        a host can be grouped too. Reducing the scope to an environment.`
      },
      { headline: 'Who uses this a lot?', htmlContent: `SRE, operations, DevOps, developers` },
      {
        headline: 'Some tips for using',
        htmlContent: `Combine this with a location (e.g., agent.zone) or
        cluster (kubernetes.cluster.name) to distinguish environments. If you will use
        this for troubleshooting then you want to see the end-to-end flow. Please set
        downstream service to ON and choose Inbound Calls.. Click on “All Filters” if
        you don’t see the tag you want. All downstream service=off unless …
        Infrastructure has dependencies between them so monitor them as a group of
        related services in an infrastructure perspective. This is done at different
        levels of scale.`
      }
    ],
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
