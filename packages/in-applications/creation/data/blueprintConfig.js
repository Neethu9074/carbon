export const blueprintConfig = Object.freeze([
  {
    type: 'servicesEndpoints',
    name: 'Services & Endpoints',
    headline: 'A collection of services or endpoints',
    description: [
      {
        headline: 'What is this for?',
        htmlContent:
          'If the services or endpoints are well known and the group won’t change soon. This is often an application that a specific team is responsible for, or which provides a single function (eg. Payment Application). This is the simplest approach.'
      },
      {
        headline: 'Who uses this a lot?',
        htmlContent: 'DevOps, Operations, SRE, Developer, QA, Support, Business owner.'
      },
      {
        headline: 'Some tips for using',
        htmlContent: `
          Use string operators (e.g., like “contains”, “starts with”) to select several services with one filter.<br>
          Add setup,  environment, or custom tags to narrow the scope. <br>
          Use "No downstream services" and "Inbound calls" for the source's perspective.<br>
          Use "All downstream services" and  "All calls" for the end-to-end view.<br>
          Use "Immediate downstream services" to include the direct database or messaging services.<br>
          Click on “All Filters”to add additional tags.
        `
      }
    ]
  },
  {
    type: 'location',
    name: 'Location: env, geo or host.',
    headline: 'An environment or region (eg. prod, staging, US East)',
    description: [
      {
        headline: 'What is this for?',
        htmlContent: `When you want to group services using information from the environment, such as
        <ul><li>Cloud information</li>
        <li>Zone names</li>
        <li>Host name or ID</li></ul>
        It can be added to distinguish between different environments.
        `
      },
      { headline: 'Who uses this a lot?', htmlContent: `DevOps, Operations, SRE, QA, Business owner` },
      {
        headline: 'Some tips for using',
        htmlContent: `Use "No downstream services" and "Inbound calls" for the source's perspective. <br>
        Use "All downstream services" and  "All calls" for the end-to-end view.<br>
        Use "Immediate downstream services" to include the direct database or messaging services.
        `
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
    type: 'container',
    name: 'Container:  K8s or related. ',
    headline: 'An application modeled by Kubernetes or container labels',
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
      { headline: 'Who uses this a lot?', htmlContent: `DevOps, Operations, SRE, Developer` },
      {
        headline: 'Some tips for using.',
        htmlContent: `Add setup,  environment, or custom tags to narrow the scope.<br>
        Use "No downstream services" and "Inbound calls" for the source's perspective.<br>
        Use "All downstream services" and  "All calls" for the end-to-end view.<br>
        Use "Immediate downstream services" to include the direct database or messaging services.
        `
      }
    ],
    curatedTagFilters: [
      {
        category: 'Container',
        tags: ['container.name', 'container.image.name', 'docker.compose.service', 'docker.image.name', 'docker.label']
      },
      {
        category: 'Kubernetes',
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
          'kubernetes.cluster.name',
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
    type: 'httpOrRpc',
    name: 'HTTP or RPC',
    headline: 'An application based on request attributes (eg. HTTP headers, query parameters)',
    description: [
      {
        headline: 'What is this for?',
        htmlContent: `It can be added to distinguish between different environments.
        <ul><li>HTTP headers, including X-headers</li>
        <li>HTTP return code status</li>
        <li>Portions of the URL</li>
        <li>Request parameters</li>
        <li>RPC method or object.</li>
        </ul>
        There are several RPC protocols supported using similar operators.

      `
      },
      { headline: 'Who uses this a lot?', htmlContent: `DevOps, Operations, SRE, Developer, QA, Support` },
      {
        headline: 'Some tips for using.',
        htmlContent: `
      Use string operators (e.g., like “contains”, “starts with”) to simplify the filter.<br>
      Add setup,  environment, or custom tags to narrow the scope.<br>
      Use "No downstream services" and "Inbound calls" for the source's perspective.<br>
      Use "All downstream services" and  "All calls" for the end-to-end view.<br>
      Use "Immediate downstream services" to include the direct database or messaging services.
      `
      }
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
    headline: 'All services of a specific technology (eg. MySQL, all databases)',
    description: [
      {
        headline: 'What is this for?',
        htmlContent: `A coarse grouping by the type of technology or application:
        <ul><li>Database details, like the schema</li>
        <li>Java application name</li>
        <li>A scripting application name</li></ul>

      `
      },
      {
        headline: 'Who uses this a lot?',
        htmlContent: `Operations, SRE, Developer, QA, Support, Business owner`
      },
      {
        headline: 'Some tips for using',
        htmlContent: `
      Use "No downstream services" and "Inbound calls" for the source's perspective.</br>
      Use "All downstream services" and  "All calls" for the end-to-end view.</br>
      Use "Immediate downstream services" to include the direct database or messaging services.
      `
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
    headline: 'An application based on custom metadata added by your or your platform',
    description: [
      {
        headline: 'What is this for?',
        htmlContent: `Adding your own data via the SDK, the platform, etc. is easy This custom data can be used to form an AP from:
        <ul><li>HTTP protocol</li>
        <li>Instana agent</li>
        <li>AWS</li>
        <li>Data that is attached to a call</li>
        <li>Kubernetes labels</li>
        <li>Container labels</li></ul>
        This blueprint puts them all together so they are easy to find.

      `
      },
      {
        headline: 'Who uses this a lot?',
        htmlContent: `DevOps, Developer, QA`
      },
      {
        headline: 'Some tips for using',
        htmlContent: `Use "No downstream services" and "Inbound calls" for the source's perspective.<br>
        Use "All downstream services" and  "All calls" for the end-to-end view.<br>
        Use "Immediate downstream services" to include the direct database or messaging services.
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
        category: 'Platform',
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
