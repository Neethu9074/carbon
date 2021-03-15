/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

const whenToUse = t('in-applications:creation.simple.blueprints.whenToUse');
const whoShouldUse = t('in-applications:creation.simple.blueprints.whoShouldUse');
const tipsForUsing = t('in-applications:creation.simple.blueprints.tipsForUsing');

export const blueprintConfig = Object.freeze([
  {
    type: 'servicesEndpoints',
    name: t('in-applications:creation.simple.blueprints.servicesEndpoints.name'),
    headline: t('in-applications:creation.simple.blueprints.servicesEndpoints.headline'),
    description: [
      {
        headline: whenToUse,
        htmlContent: t('in-applications:creation.simple.blueprints.servicesEndpoints.whenToUse')
      },
      {
        headline: whoShouldUse,
        htmlContent: t('in-applications:creation.simple.blueprints.servicesEndpoints.whoShouldUse')
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.useOperatorsServices')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.narrowScope')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.sourcePerspective')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.endToEndView')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.directServices')}</li>
          </ul>
        `
      }
    ]
  },
  {
    type: 'userJourney',
    name: t('in-applications:creation.simple.blueprints.userJourney.name'),
    headline: t('in-applications:creation.simple.blueprints.userJourney.headline'),
    description: [
      {
        headline: whenToUse,
        htmlContent: `<a href="https://cloud.google.com/blog/products/management-tools/practical-guide-to-setting-slos" target=”_blank” rel=”noopener noreferrer”>${t(
          'in-applications:creation.simple.blueprints.userJourney.whenToUse.userJourneyDescribes'
        )}</a>
        ${t('in-applications:creation.simple.blueprints.userJourney.whenToUse.otherTerms')}`
      },
      {
        headline: whoShouldUse,
        htmlContent: t('in-applications:creation.simple.blueprints.userJourney.whoShouldUse')
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.preselected')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.switchMode')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.useOperatorsEndpoints')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.narrowScope')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.allFilters')}</li>
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
    name: t('in-applications:creation.simple.blueprints.location.name'),
    headline: t('in-applications:creation.simple.blueprints.location.headline'),
    description: [
      {
        headline: whenToUse,
        htmlContent: `
          ${t('in-applications:creation.simple.blueprints.location.whenToUse.header')}
          <ul>
            <li>${t('in-applications:creation.simple.blueprints.location.whenToUse.cloudInfo')}</li>
            <li>${t('in-applications:creation.simple.blueprints.location.whenToUse.zoneRegion')}</li>
            <li>${t('in-applications:creation.simple.blueprints.location.whenToUse.hostId')}</li>
          </ul>
        `
      },
      {
        headline: whoShouldUse,
        htmlContent: t('in-applications:creation.simple.blueprints.location.whoShouldUse')
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.sourcePerspective')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.endToEndView')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.directServices')}</li>
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
    name: t('in-applications:creation.simple.blueprints.customerOrTenant.name'),
    headline: t('in-applications:creation.simple.blueprints.customerOrTenant.headline'),
    description: [
      {
        headline: whenToUse,
        htmlContent: `
          ${t('in-applications:creation.simple.blueprints.customerOrTenant.whenToUse.header')}
          <ul>
            <li>${t('in-applications:creation.simple.blueprints.customerOrTenant.whenToUse.httpParam')}</li>
            <li>${t('in-applications:creation.simple.blueprints.customerOrTenant.whenToUse.manual', {
              url: 'https://instana.com/docs/tracing/tracing-sdks/#searchable-content-wrapper'
            })}</li>
          </ul>
          ${t('in-applications:creation.simple.blueprints.customerOrTenant.whenToUse.footer')}
          `
      },
      {
        headline: whoShouldUse,
        htmlContent: t('in-applications:creation.simple.blueprints.customerOrTenant.whoShouldUse')
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.specifyAp')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.sourcePerspective')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.endToEndView')}</li>
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
    name: t('in-applications:creation.simple.blueprints.container.name'),
    headline: t('in-applications:creation.simple.blueprints.container.headline'),
    description: [
      {
        headline: whenToUse,
        htmlContent: `
          ${t('in-applications:creation.simple.blueprints.container.whenToUse.header')}
          <ul>
            <li>${t('in-applications:creation.simple.blueprints.container.whenToUse.namespace')}</li>
            <li>${t('in-applications:creation.simple.blueprints.container.whenToUse.imageName')}</li>
            <li>${t('in-applications:creation.simple.blueprints.container.whenToUse.serviceNames')}</li>
            <li>${t('in-applications:creation.simple.blueprints.container.whenToUse.deployInfo')}</li>
            <li>${t('in-applications:creation.simple.blueprints.container.whenToUse.labels')}</li>
          </ul>

          ${t('in-applications:creation.simple.blueprints.container.whenToUse.footer')}`
      },
      {
        headline: whoShouldUse,
        htmlContent: t('in-applications:creation.simple.blueprints.container.whoShouldUse')
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.narrowScope')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.sourcePerspective')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.endToEndView')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.directServices')}</li>
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
    name: t('in-applications:creation.simple.blueprints.httpOrRpc.name'),
    headline: t('in-applications:creation.simple.blueprints.httpOrRpc.headline'),
    description: [
      {
        headline: whenToUse,
        htmlContent: `${t('in-applications:creation.simple.blueprints.httpOrRpc.whenToUse.header')}
        <ul>
          <li>${t('in-applications:creation.simple.blueprints.httpOrRpc.whenToUse.headers')}</li>
          <li>${t('in-applications:creation.simple.blueprints.httpOrRpc.whenToUse.statusCodes')}</li>
          <li>${t('in-applications:creation.simple.blueprints.httpOrRpc.whenToUse.urlPortions')}</li>
          <li>${t('in-applications:creation.simple.blueprints.httpOrRpc.whenToUse.reqParams')}</li>
          <li>${t('in-applications:creation.simple.blueprints.httpOrRpc.whenToUse.methodObject')}</li>
        </ul>
        ${t('in-applications:creation.simple.blueprints.httpOrRpc.whenToUse.footer')}
      `
      },
      {
        headline: whoShouldUse,
        htmlContent: t('in-applications:creation.simple.blueprints.httpOrRpc.whoShouldUse')
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.useOperators')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.narrowScope')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.sourcePerspective')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.endToEndView')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.directServices')}</li>
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
    name: t('in-applications:creation.simple.blueprints.technologyGrouping.name'),
    headline: t('in-applications:creation.simple.blueprints.technologyGrouping.headline'),
    description: [
      {
        headline: whenToUse,
        htmlContent: `
          ${t('in-applications:creation.simple.blueprints.technologyGrouping.whenToUse.header')}
          <ul>
            <li>${t('in-applications:creation.simple.blueprints.technologyGrouping.whenToUse.databaseDetails')}</li>
            <li>${t('in-applications:creation.simple.blueprints.technologyGrouping.whenToUse.javaName')}</li>
            <li>${t('in-applications:creation.simple.blueprints.technologyGrouping.whenToUse.scriptingName')}</li>
          </ul>
      `
      },
      {
        headline: whoShouldUse,
        htmlContent: t('in-applications:creation.simple.blueprints.technologyGrouping.whoShouldUse')
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.sourcePerspective')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.endToEndView')}</li>
            <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.directServices')}</li>
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
    name: t('in-applications:creation.simple.blueprints.custom.name'),
    headline: t('in-applications:creation.simple.blueprints.custom.headline'),
    description: [
      {
        headline: whenToUse,
        htmlContent: `
          ${t('in-applications:creation.simple.blueprints.custom.whenToUse.header')}
          <ul>
            <li>${t('in-applications:creation.simple.blueprints.custom.whenToUse.httpProtocol')}</li>
            <li>${t('in-applications:creation.simple.blueprints.custom.whenToUse.instanaAgent')}</li>
            <li>${t('in-applications:creation.simple.blueprints.custom.whenToUse.aws')}</li>
            <li>${t('in-applications:creation.simple.blueprints.custom.whenToUse.dataCall')}</li>
            <li>${t('in-applications:creation.simple.blueprints.custom.whenToUse.kubernetesLabels')}</li>
            <li>${t('in-applications:creation.simple.blueprints.custom.whenToUse.containerLabels')}</li>
          </ul>
          ${t('in-applications:creation.simple.blueprints.custom.whenToUse.footer')}
      `
      },
      {
        headline: whoShouldUse,
        htmlContent: t('in-applications:creation.simple.blueprints.custom.whoShouldUse')
      },
      {
        headline: tipsForUsing,
        htmlContent: `
          <ul>
          <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.sourcePerspective')}</li>
          <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.endToEndView')}</li>
          <li>${t('in-applications:creation.simple.blueprints.tipsForUsingItems.directServices')}</li>
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
