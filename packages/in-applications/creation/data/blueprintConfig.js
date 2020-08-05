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
    ]
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
          'kubernetes.label',
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
          'cloudfoundry.application.name',
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
  },
  {
    type: 'httpOrRpc',
    name: 'HTTP or RPC',
    headline: 'HTTP or RPC',
    description: [
      {
        headline: 'What is this for?',
        htmlContent: `Standard HTTP header information can group services, even from the source or destination information.  User defined X-headers can be used too. The HTTP status can group services using integer operators, such as: greater than, less than, equals, etc. The URL itself can form a perspective using powerful operators like: beings with, contains, does not contain, etc. There are several RPC protocols supported using similar operators.
      `
      },
      { headline: 'Who uses this a lot?', htmlContent: `DevOps, Operations, SRE, Developer, QA, support` }
    ],
    curatedTagFilters: [
      {
        category: 'HTTP Header',
        tags: ['call.http.header']
      },
      {
        category: 'HTTP URL',
        tags: ['call.http.path', 'call.http.pathTemplate', 'call.http.method', 'call.http.params', 'call.http.url']
      },
      {
        category: 'HTTP Misc',
        tags: ['call.http.host', 'call.http.protocol', 'call.http.status']
      },
      {
        category: 'RPC',
        tags: ['call.rpc.method', 'call.rpc.object']
      }
    ]
  },
  {
    type: 'technologyGrouping',
    name: 'Technology Grouping',
    headline: 'Technology Grouping',
    description: [
      {
        headline: 'What is this for?',
        htmlContent: `A coarse grouping by all the services of the same technology provides a high level perspective. Some technologies have tags that can further refine the group. For example, databases can be grouped by schema, type, or connection. Java is a well supported technology with grouping by deployment information or JVM name. Grouping by applications for scripting languages are supported.
      `
      },
      {
        headline: 'Who uses this a lot?',
        htmlContent: `DevOps, Operations, SRE, Developer, QA, support, Business owner, Architect`
      }
    ],
    curatedTagFilters: [
      {
        category: 'Database',
        tags: ['call.database.connection', 'call.database.scheme', 'call.database.type']
      },
      { category: 'Technology', tags: ['call.type', 'technology'] },
      { category: 'Java', tags: ['call.deployment.name', 'jboss.server.name', 'jvm.app.name', 'springboot.name'] },
      { category: 'Scripting', tags: ['nodejs.app.name', 'nodejs.app.version', 'nodejs.version', 'ruby.app.name'] }
    ]
  },
  {
    type: 'custom',
    name: 'Custom Tags',
    headline: 'Custom Tags',
    description: [
      {
        headline: 'What is this for?',
        htmlContent: `Users add their own custom meta-data to calls using the SDK and then these calls are used to create the perspectives they want. These custom tags are available in this blueprint to make them easy to find. These include HTTP, agent, AWS, call, kubernetes, and docker related custom tags or labels.
      `
      },
      {
        headline: 'Who uses this a lot?',
        htmlContent: `Developers, DevOps, Operations, SRE, QA, Support
        `
      }
    ],
    curatedTagFilters: [
      {
        category: 'HTTP',
        tags: ['call.http.header', 'call.http.params', 'call.http.pathTemplate']
      },
      { category: 'Miscellaneous', tags: ['agent.tag', 'aws.ec2.tag', 'call.inbound_of_application', 'call.tag'] },
      {
        category: 'Kubernetes',
        tags: [
          'docker.label',
          'kubernetes.label',
          'kubernetes.deployment.label',
          'kubernetes.pod.label',
          'openshift.deploymentconfig.label'
        ]
      }
    ]
  }
]);
