const customEumConfiguration = {
  title: 'EUM Custom Dashboard demo',
  id: 1,
  panels: [
    {
      id: 1,
      title: 'loadbalancer-eum (edge)',
      panelType: 'section-title'
    },
    {
      id: 2,
      panelType: 'chart',
      title: 'Requests',
      description: '',
      searchQuery: 'entity.host.name:"loadbalancer-eum-*"',
      restrictResultEntityType: 'nginx',
      pluginIdForMetrics: 'nginx',
      y1: {
        metrics: ['requests'],
        labels: {
          template: '{{ takeFirst $.host.label 3 "-" }}'
        },
        format: 'number.perSecond.compact',
        type: 'stackedArea'
      },
      y2: {
        metrics: ['connections.dropped'],
        labels: {
          template: '{{ takeFirst $.host.label 3 "-" }}'
        },
        format: 'number.perSecond.compact',
        type: 'stackedArea'
      }
    },
    {
      id: 3,
      panelType: 'chart',
      title: 'Dropped connections',
      description: '',
      searchQuery: 'entity.host.name:"loadbalancer-eum-*"',
      restrictResultEntityType: 'nginx',
      pluginIdForMetrics: 'nginx',
      y1: {
        metrics: ['connections.dropped'],
        labels: {
          template: '{{ takeFirst $.host.label 3 "-" }}'
        },
        format: 'number.perSecond.compact',
        type: 'line'
      }
    },
    {
      id: 4,
      panelType: 'chart',
      title: 'CPU load',
      description: '',
      searchQuery: 'entity.host.name:"loadbalancer-eum-*"',
      restrictResultEntityType: 'nginx',
      pluginIdForMetrics: 'host',
      y1: {
        metrics: ['load.1min'],
        labels: {
          template: '{{ $.host.label }}'
        },
        format: 'number.detailed',
        type: 'line'
      }
    },
    {
      id: 5,
      panelType: 'table',
      title: 'CPU usage',
      maxItemsPerPage: 4,
      searchQuery: 'entity.host.name:"loadbalancer-eum-*"',
      restrictResultEntityType: 'nginx',
      columns: [
        {
          title: 'Host',
          type: 'snapshotLink',
          typeArgs: {
            snapshotIdLocation: 'host',
          }
        },
        {
          title: 'User',
          type: 'metric',
          typeArgs: {
            snapshotIdLocation: 'host',
            metric: 'cpu.user',
            timeWindowAggregation: 'mean'
          }
        },
        {
          title: 'System',
          type: 'metric',
          typeArgs: {
            snapshotIdLocation: 'host',
            metric: 'cpu.sys',
            timeWindowAggregation: 'mean'
          }
        },
        {
          title: 'Wait',
          type: 'metric',
          typeArgs: {
            snapshotIdLocation: 'host',
            metric: 'cpu.wait',
            timeWindowAggregation: 'mean'
          }
        },
        {
          title: 'Nice',
          type: 'metric',
          typeArgs: {
            snapshotIdLocation: 'host',
            metric: 'cpu.nice',
            timeWindowAggregation: 'mean'
          }
        },
        {
          title: 'Steal',
          type: 'metric',
          typeArgs: {
            snapshotIdLocation: 'host',
            metric: 'cpu.steal',
            timeWindowAggregation: 'mean'
          }
        }
      ],
      rowDetails: [{
        pluginIdForMetrics: 'host',
        labels: ['User', 'System', 'Wait', 'Nice', 'Steal'],
        metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal'],
        format: 'percentageZeroDecimalPlaces',
        tooltipFormatter: '',
        type: 'stackedArea'
      }]
    },
    {
      id: 6,
      title: 'eum-acceptor (data collection)',
      panelType: 'section-title'
    },
    {
      id: 7,
      panelType: 'chart',
      title: 'Beacon Requests',
      description: '',
      searchQuery: 'entity.label:"eum-acceptor"',
      restrictResultEntityType: 'dropwizardApplicationContainer',
      pluginIdForMetrics: 'dropwizardApplicationContainer',
      y1: {
        labels: {
          template: '{{ takeFirst $.host.label 1 "." }}'
        },
        metrics: ['metrics.meters.instana.beaconRequests.total'],
        format: 'number.perSecond.compact',
        type: 'stackedArea'
      }
    },
    {
      id: 8,
      panelType: 'chart',
      title: 'Young generation GC time',
      description: '',
      searchQuery: 'entity.label:"eum-acceptor"',
      restrictResultEntityType: 'dropwizardApplicationContainer',
      pluginIdForMetrics: 'jvmRuntimePlatform',
      y1: {
        metrics: ['gc.G1 Young Generation.time'],
        labels: {
          template: '{{ takeFirst $.host.label 3 "-" }}'
        },
        format: 'time',
        tooltipFormatter: 'number.detailed',
        type: 'line'
      }
    },
    {
      id: 9,
      title: 'eum-processor (data processing)',
      panelType: 'section-title'
    },
    {
      id: 10,
      panelType: 'chart',
      title: 'Incoming Website Beacons',
      description: '',
      searchQuery: 'entity.label:"eum-processor"',
      restrictResultEntityType: 'dropwizardApplicationContainer',
      pluginIdForMetrics: 'dropwizardApplicationContainer',
      y1: {
        metrics: ['metrics.meters.KPI.incoming.website_monitoring_beacons.calls'],
        labels: {
          template: '{{  takeFirst $.host.label 3 "-" }}'
        },
        format: 'number.perSecond.compact',
        tooltipFormatter: '',
        type: 'stackedArea'
      }
    },
    {
      id: 11,
      panelType: 'chart',
      title: 'Failed Incoming Website Beacons',
      description: '',
      searchQuery: 'entity.label:"eum-processor"',
      restrictResultEntityType: 'dropwizardApplicationContainer',
      pluginIdForMetrics: 'dropwizardApplicationContainer',
      y1: {
        metrics: ['metrics.meters.KPI.incoming.website_monitoring_beacons.errors'],
        labels: {
          template: '{{ takeFirst $.host.label 3 "-" }}'
        },
        format: 'number.perSecond.compact',
        tooltipFormatter: '',
        type: 'stackedArea'
      }
    },
    {
      id: 12,
      panelType: 'chart',
      title: 'Outgoing Processed Website Beacons',
      description: '',
      searchQuery: 'entity.label:"eum-processor"',
      restrictResultEntityType: 'dropwizardApplicationContainer',
      pluginIdForMetrics: 'dropwizardApplicationContainer',
      y1: {
        metrics: ['metrics.meters.KPI.outgoing.processed_website_monitoring_beacons.calls'],
        labels: {
          template: '{{ takeFirst $.host.label 3 "-" }}'
        },
        format: 'number.perSecond.compact',
        tooltipFormatter: '',
        type: 'stackedArea'
      }
    },
    {
      id: 13,
      panelType: 'chart',
      title: 'Failed Outgoing Processed Website Beacons',
      description: '',
      searchQuery: 'entity.label:"eum-processor"',
      restrictResultEntityType: 'dropwizardApplicationContainer',
      pluginIdForMetrics: 'dropwizardApplicationContainer',
      y1: {
        metrics: ['metrics.meters.KPI.outgoing.processed_website_monitoring_beacons.errors'],
        labels: {
          template: '{{ takeFirst $.host.label 3 "-" }}'
        },
        format: 'number.perSecond.compact',
        tooltipFormatter: '',
        type: 'stackedArea'
      }
    },
    {
      id: 14,
      title: 'appdata-writer (data ingestion)',
      panelType: 'section-title'
    },
    {
      id: 15,
      panelType: 'chart',
      title: 'Incoming Processed Website Beacons',
      description: '',
      searchQuery: 'entity.label:"appdata-writer"',
      restrictResultEntityType: 'dropwizardApplicationContainer',
      pluginIdForMetrics: 'dropwizardApplicationContainer',
      y1: {
        metrics: ['metrics.meters.KPI.incoming.website_monitoring_processed_beacons.calls'],
        labels: {
          template: '{{ takeFirst $.host.label 3 "-" }}'
        },
        format: 'number.perSecond.compact',
        tooltipFormatter: '',
        type: 'stackedArea'
      }
    },
    {
      id: 16,
      panelType: 'chart',
      title: 'Failed Incoming Website Beacons',
      description: '',
      searchQuery: 'entity.label:"appdata-writer"',
      restrictResultEntityType: 'dropwizardApplicationContainer',
      pluginIdForMetrics: 'dropwizardApplicationContainer',
      y1: {
        metrics: ['metrics.meters.KPI.incoming.website_monitoring_processed_beacons.errors'],
        labels: {
          template: '{{ takeFirst $.host.label 3 "-" }}'
        },
        format: 'number.perSecond.compact',
        type: 'stackedArea'
      }
    },
    {
      id: 17,
      panelType: 'chart',
      title: 'Successfully Written Shortterm Website Beacons',
      description: '',
      searchQuery: 'entity.label:"appdata-writer"',
      restrictResultEntityType: 'dropwizardApplicationContainer',
      pluginIdForMetrics: 'dropwizardApplicationContainer',
      y1: {
        metrics: ['metrics.meters.com.instana.appdata.writer.service.BeaconsWriter.num-written-shortterm-items'],
        labels: {
          template: '{{ takeFirst $.host.label 3 "-" }}'
        },
        format: 'number.perSecond.compact',
        tooltipFormatter: '',
        type: 'stackedArea'
      }
    },
    {
      id: 18,
      panelType: 'chart',
      title: 'Unsuccessfully Written Shortterm Website Beacons',
      description: '',
      searchQuery: 'entity.label:"appdata-writer"',
      restrictResultEntityType: 'dropwizardApplicationContainer',
      pluginIdForMetrics: 'dropwizardApplicationContainer',
      y1: {
        metrics: ['metrics.meters.com.instana.appdata.writer.service.BeaconsWriter.num-failed-shortterm-items'],
        labels: {
          template: '{{ takeFirst $.host.label 3 "-" }}'
        },
        format: 'number.perSecond.compact',
        tooltipFormatter: '',
        type: 'stackedArea'
      }
    },
    {
      id: 19,
      panelType: 'list',
      title: 'Aailable Instana Units',
      items: [
        {
          label: 'SaaS Monitoring Units',
          description: 'These two units exist to monitor our own SaaS installations. They themselves are SaaS units.',
          items: [
            {
              label: 'EU',
              href: 'https://eu-instanaops.instana.io',
              isExtenal: true,
              description: 'Unit monitoring the EU SaaS installation, as well as the environment-wide components Groundskeeper, Butler and CockroachDB.'
            },
            {
              label: 'US',
              href: 'https://us-instanaops.instana.io',
              isExternal: true,
              description: 'Unit monitoring the US SaaS installation.',
            }
          ]
        },
        {
          label: 'Development Units',
          description: 'These units are designed to be used mainly by the product organization of Instana to continue to evolve Instana itself.',
          items: [
            {
              label: 'Test',
              href: 'https://test-instana.instana.io',
              isExternal: true,
              description: 'Auto-deployed on every commit to the develop branches. This is the unit on which most of the engineering work is integrated first. Notoriously unstable due to the deployment frequency. Choose a different unit if possible.'
            },
            {
              label: 'Release',
              href: 'https://release-instana.instana.io',
              isExternal: true,
              description: 'Auto-deployed from the release-XYZ branch on every commit. Mainly used as part of the release preparation, but also for hot-fixes.'
            },
            {
              label: 'Load',
              href: 'https://load-instana.instana.io',
              isExternal: true,
              description: 'Used to execute load tests and other experiments. Typically used as part of the release preparation.'
            }
          ]
        },
        {
          label: 'Demo Units',
          description: 'These units are frequently used by the whole company for demo / presentation purposes.',
          items: [
            {
              label: 'current',
              href: 'https://current-instana.instana.io',
              isExternal: true,
              description: 'A SaaS demo unit running within the US.'
            },
            {
              label: 'current2',
              href: 'https://current2-instana.instana.io',
              isExternal: true,
              description: 'A SaaS demo unit running within EU. This one is typically only used when \'current\' is unavailable.'
            },
            {
              label: 'demo',
              href: 'https://demo-demo.instana.io',
              isExternal: true,
              description: 'This unit will replace the \'current\' and \'current2\' unit once the demo setup is finished. The RobotShop is deployed here.'
            }
          ]
        },
        {
          label: 'Kubernetes Based Units',
          description: 'Kubernetes based environments are currently being build. They aren\'t yet ready to replace our day-to-day environments, but will be in the near future. Once they are ready they will replace the similarly named non-Kubernetes based units.',
          items: [
            {
              label: 'Test',
              href: 'https://test-instana.pink.instana.rocks',
              isExternal: true,
              description: 'Auto-deployed from the develop branches every hour.',
            },
            {
              label: 'Nightly',
              href: 'https://nightly-instana.pink.instana.rocks',
              isExternal: true,
              description: 'Auto-deployed from the develop branches every night.',
            },
            {
              label: 'Staging',
              href: 'https://staging-instana.peach.instana.rocks',
              isExternal: true,
              description: 'Auto-deployed from the release-XYZ branch on every commit.',
            },
            {
              label: 'Preview',
              href: 'https://preview-instana.peach.instana.rocks',
              isExternal: true,
              description: 'Manually deployed latest release-XYZ branch 1 week before the SaaS release. Sales / CS / SE / PM has access to this unit.',
            },
            {
              label: 'Release',
              href: 'https://release-instana.magenta.instana.rocks',
              isExternal: true,
              description: 'Manually deployed latest release-XYZ on demand.',
            },
            {
              label: 'Load',
              href: 'https://load-instana.rose.instana.rocks',
              isExternal: true,
              description: 'Manually deployed from any branch on demand.',
            },
            {
              label: 'SRE',
              href: 'ttps://sre-instana.melon.instana.rocks',
              isExternal: true,
              description: 'Manually deployed from any branch on demand. Used by SRE to develop instanactl.',
            }

          ]
        }

      ]
    }
  ],
  layout: [
    ['1'],
    ['2', '3'],
    ['4', '5'],
    ['6'],
    ['7', '8'],
    ['9'],
    ['10', '11'],
    ['12', '13'],
    ['14'],
    ['15', '16'],
    ['17', '18'],
    ['19']
  ]
};

export default customEumConfiguration;
