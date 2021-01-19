/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
const whenToUse = 'When to use?';
const whoShouldUse = 'Who should use?';
const tipsForUsing = 'Tips for using';

export const blueprintConfig = Object.freeze([
  {
    type: 'servicesEndpoints',
    name: 'Services or Endpoints',
    headline: 'A collection of services or endpoints',
    description: [
      {
        headline: whenToUse,
        htmlContent:
          'If the services or endpoints are well known and the group won’t change soon. This is often an application that a specific team is responsible for, or which provides a single function (eg. Payment Application). This is the simplest approach.'
      },
      {
        headline: whoShouldUse,
        htmlContent: 'DevOps, Operations, SRE, Developer, QA, Support, Business owner.'
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>Use string operators (e.g., like “contains”, “starts with”) to select several services with one filter.</li>
            <li>Add setup,  environment, or custom tags to narrow the scope.</li>
            <li>Use "No downstream services" and "Inbound calls" for the source's perspective.</li>
            <li>Use "All downstream services" and  "All calls" for the end-to-end view.</li>
            <li>Use "Immediate downstream services" to include the direct database or messaging services.</li>
          </ul>
        `
      }
    ]
  },
  {
    type: 'userJourney',
    name: 'A critical user journey',
    headline: 'A critical user journey',
    description: [
      {
        headline: whenToUse,
        htmlContent: `<a href="https://cloud.google.com/blog/products/management-tools/practical-guide-to-setting-slos" target=”_blank” rel=”noopener noreferrer”>A critical user journey describes a set of interactions a user has with a service to achieve some end result.</a>
        Other terms for a user journey are business use case or business transaction. Identifying user journeys are the first step in using Instana’s SLI/SLO.
        So select the service or endpoints that form the critical user journey to monitor.

          `
      },
      {
        headline: whoShouldUse,
        htmlContent: 'DevOps, Operations, SRE, Business owner.'
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>The "Inbound calls" and  "All downstream services" are preselected.</li>
            <li>Switch to Advanced Mode to create a query with endpoints from multiple services.</li>
            <li>Use string operators (e.g., like “contains”, “starts with”) to select several endpoints with one filter.</li>
            <li>Add setup,  environment, or custom tags to narrow the scope.</li>
            <li>Click on “All Filters”to add additional tags.</li>
          </ul>
        `
      }
    ],
    presetFormFields: {
      applicationScope: 'INCLUDE_ALL_DOWNSTREAM',
      boundaryScope: 'ALL'
    }
  },
  {
    type: 'location',
    name: 'Environment or Region',
    headline: 'An environment or region (eg. prod, staging, US East)',
    description: [
      {
        headline: whenToUse,
        htmlContent: `
          When you want to model applications using information from the environment, such as:
          <ul>
            <li>Cloud information</li>
            <li>Zone or region</li>
            <li>Host name or ID</li>
          </ul>
        `
      },
      { headline: whoShouldUse, htmlContent: `DevOps, Operations, SRE, QA, Business owner` },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>Use "No downstream services" and "Inbound calls" for the source's perspective.</li>
            <li>Use "All downstream services" and  "All calls" for the end-to-end view.</li>
            <li>Use "Immediate downstream services" to include the direct database or messaging services.</li>
          </ul>
        `
      }
    ],
    curatedTagFilters: [
      {
        category: 'Zone',
        tags: ['agent.zone', 'aws.ec2.zone', 'azure.zone', 'gce.zone', 'cloudfoundry.space.name']
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
          'gce.zone',
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
    type: 'customerOrTenant',
    name: 'An important customer or tenant',
    headline: 'An important customer or tenant',
    description: [
      {
        headline: whenToUse,
        htmlContent: `
          Important customers or tenants can have their own dashboard when there is an AP specified for them. There are two common ways that are used to identify the customer:
          <ul>
            <li>An HTTP parameter is the data used to identify a customer or tenant.</li>
            <li>Manual instrumentation to add meta-data to a span using <a href="https://instana.com/docs/tracing/tracing-sdks/#searchable-content-wrapper" target=”_blank” rel=”noopener noreferrer”>the tracing SDK</a>.</li>
          </ul>
          These tags can then be specified to construct an AP.`
      },
      { headline: whoShouldUse, htmlContent: `DevOps, Operations, SRE, QA, Business owner` },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>Use either request parameters or custom tags to specify the AP.</li>
            <li>Use "No downstream services" and "Inbound calls" for the source's perspective.</li>
            <li>Use "All downstream services" and  "All calls" for the end-to-end view.</li>
          </ul>
        `
      }
    ],
    curatedTagFilters: [
      {
        category: 'HTTP',
        tags: ['call.http.params']
      },
      {
        category: 'Custom Tag',
        tags: ['call.tag']
      }
    ]
  },
  {
    type: 'container',
    name: 'Kubernetes or Container',
    headline: 'An application modeled by Kubernetes or container labels',
    description: [
      {
        headline: whenToUse,
        htmlContent: `
          When you want to group services based on:
            <ul>
              <li>Namespace (this is frequently used)</li>
              <li>Container or image name</li>
              <li>Platform related service names</li>
              <li>Deployment information</li>
              <li>Labels</li>
            </ul>

          Tags are available for:  Kubernetes, OpenShift, Docker, Cloud Foundry, Marathon, and Nomad.`
      },
      { headline: whoShouldUse, htmlContent: `DevOps, Operations, SRE, Developer` },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>Add setup,  environment, or custom tags to narrow the scope.</li>
            <li>Use "No downstream services" and "Inbound calls" for the source's perspective.</li>
            <li>Use "All downstream services" and  "All calls" for the end-to-end view.</li>
            <li>Use "Immediate downstream services" to include the direct database or messaging services.</li>
          </ul>
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
    name: 'Request Attributes',
    headline: 'An application based on request attributes (eg. HTTP headers, query parameters)',
    description: [
      {
        headline: whenToUse,
        htmlContent: `It can be added to distinguish between different environments.
        <ul>
          <li>HTTP headers, including X-headers</li>
          <li>HTTP return code status</li>
          <li>Portions of the URL</li>
          <li>Request parameters</li>
          <li>RPC method or object.</li>
        </ul>
        There are several RPC protocols supported using similar operators.
      `
      },
      { headline: whoShouldUse, htmlContent: `DevOps, Operations, SRE, Developer, QA, Support` },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>Use string operators (e.g., like “contains”, “starts with”) to simplify the filter.</li>
            <li>Add setup,  environment, or custom tags to narrow the scope.</li>
            <li>Use "No downstream services" and "Inbound calls" for the source's perspective.</li>
            <li>Use "All downstream services" and  "All calls" for the end-to-end view.</li>
            <li>Use "Immediate downstream services" to include the direct database or messaging services.</li>
          </ul>
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
    name: 'Technology',
    headline: 'All services of a specific technology (eg. MySQL, all databases)',
    description: [
      {
        headline: whenToUse,
        htmlContent: `
        A coarse grouping by the type of technology or application:
        <ul>
          <li>Database details, like the type or schema</li>
          <li>Java application name</li>
          <li>A scripting application name</li>
        </ul>
      `
      },
      {
        headline: whoShouldUse,
        htmlContent: `Operations, SRE, Developer, QA, Support, Business owner`
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>Use "No downstream services" and "Inbound calls" for the source's perspective.</li>
            <li>Use "All downstream services" and  "All calls" for the end-to-end view.</li>
            <li>Use "Immediate downstream services" to include the direct database or messaging services.</li>
          </ul>
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
        headline: whenToUse,
        htmlContent: `
          When you want to add your own data via the SDK, the platform, etc. This custom data can be added from:
          <ul>
            <li>HTTP protocol</li>
            <li>Instana agent</li>
            <li>AWS</li>
            <li>Data that is attached to a call</li>
            <li>Kubernetes labels</li>
            <li>Container labels</li>
          </ul>
          This blueprint puts them all together so they are easy to find.
      `
      },
      {
        headline: whoShouldUse,
        htmlContent: `DevOps, Developer, QA`
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>Use "No downstream services" and "Inbound calls" for the source's perspective.</li>
            <li>Use "All downstream services" and  "All calls" for the end-to-end view.</li>
            <li>Use "Immediate downstream services" to include the direct database or messaging services.</li>
          </ul>
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
