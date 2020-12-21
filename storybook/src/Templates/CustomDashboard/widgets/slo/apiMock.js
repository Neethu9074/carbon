import { just } from '@instana/observables';

export const getApplicationConfigsAsResultObservable = () =>
  just({
    data: [
      {
        id: 'JY6YK_QzRCumfyMe_uVhAQ',
        label: 'test ceh 19',
        matchSpecification: {
          type: 'LEAF',
          key: 'call.tag.exchange',
          entity: 'NOT_APPLICABLE',
          value: 'robot-shop',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'ALL'
      },
      {
        id: 'ztaz3rEBRMe2VJlMardM1g',
        label: 'Java Demo App',
        matchSpecification: {
          type: 'BINARY_OP',
          left: {
            type: 'LEAF',
            key: 'docker.image.name',
            entity: 'SOURCE',
            value: 'java-demo/',
            operator: 'STARTS_WITH'
          },
          right: {
            type: 'LEAF',
            key: 'docker.image.name',
            entity: 'DESTINATION',
            value: 'java-demo/',
            operator: 'STARTS_WITH'
          },
          conjunction: 'OR'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'ALL'
      },
      {
        id: 'zXVH8VCOT5qeNDRVBaY4Ww',
        label: 'test ceh 15',
        matchSpecification: {
          type: 'BINARY_OP',
          left: {
            type: 'LEAF',
            key: 'service.name',
            entity: 'DESTINATION',
            value: 'shipping',
            operator: 'EQUALS'
          },
          right: {
            type: 'LEAF',
            key: 'service.name',
            entity: 'DESTINATION',
            value: 'cart',
            operator: 'NOT_EQUAL'
          },
          conjunction: 'AND'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'INBOUND'
      },
      {
        id: 'AVVW3QAQTB2OGec2HHnDSQ',
        label: 'fabian',
        matchSpecification: {
          type: 'LEAF',
          key: 'service.name',
          entity: 'DESTINATION',
          value: 'appdata-writer',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'ALL'
      },
      {
        id: 'fknUlLJ2QCOaAhTpOkIsvg',
        label: 'test ceh 21',
        matchSpecification: {
          type: 'BINARY_OP',
          left: {
            type: 'LEAF',
            key: 'container.name',
            entity: 'DESTINATION',
            value: '/acceptor-99f45f68-0ef3-43dd-e613-cdcfaecc3079',
            operator: 'EQUALS'
          },
          right: {
            type: 'LEAF',
            key: 'aws.ec2.zone',
            entity: 'DESTINATION',
            value: 'us-west-2a',
            operator: 'EQUALS'
          },
          conjunction: 'OR'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'INBOUND'
      },
      {
        id: 'vkDbpw1QTbS3BLg9q526hQ',
        label: 'eum-frontend',
        matchSpecification: {
          type: 'LEAF',
          key: 'service.name',
          entity: 'DESTINATION',
          value: 'eum-frontend',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'ALL'
      },
      {
        id: '4TFOcLkyTFe7CylUliadzg',
        label: 'graphql-blogpost',
        matchSpecification: {
          type: 'LEAF',
          key: 'agent.zone',
          entity: 'DESTINATION',
          value: 'blog_zone',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'ALL'
      },
      {
        id: 'uDaiAMSTS3-lxbUHVd1nVw',
        label: 'K8s discount app',
        matchSpecification: {
          type: 'LEAF',
          key: 'kubernetes.label.app',
          entity: 'DESTINATION',
          value: 'discount',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING',
        boundaryScope: 'INBOUND'
      },
      {
        id: '9LQFhdkBQlG0oV9jWeprKA',
        label: 'test ceh 24',
        matchSpecification: {
          type: 'LEAF',
          key: 'kubernetes.namespace',
          entity: 'DESTINATION',
          value: 'robot-shop',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'ALL'
      },
      {
        id: 'PLumMmKlSf2p8M5wfNoaGw',
        label: 'Multiple filters',
        matchSpecification: {
          type: 'BINARY_OP',
          left: {
            type: 'LEAF',
            key: 'agent.zone',
            entity: 'DESTINATION',
            value: 'Demo Database',
            operator: 'EQUALS'
          },
          right: {
            type: 'BINARY_OP',
            left: {
              type: 'LEAF',
              key: 'agent.tag.demo',
              entity: 'DESTINATION',
              value: '',
              operator: 'NOT_EMPTY'
            },
            right: {
              type: 'BINARY_OP',
              left: {
                type: 'LEAF',
                key: 'call.type',
                entity: 'NOT_APPLICABLE',
                value: 'DATABASE',
                operator: 'EQUALS'
              },
              right: {
                type: 'LEAF',
                key: 'agent.tag.production',
                entity: 'DESTINATION',
                value: '',
                operator: 'IS_EMPTY'
              },
              conjunction: 'AND'
            },
            conjunction: 'AND'
          },
          conjunction: 'AND'
        },
        scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING',
        boundaryScope: 'INBOUND'
      },
      {
        id: 'btg-B701Rx6o9QNXUS4TVw',
        label: 'All Services',
        matchSpecification: {
          type: 'LEAF',
          key: 'call.type',
          entity: 'NOT_APPLICABLE',
          value: null,
          operator: 'NOT_EMPTY'
        },
        scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING',
        boundaryScope: 'INBOUND'
      },
      {
        id: 'PLEb723nS_Cp2vWxH9Cyng',
        label: 'FabianS',
        matchSpecification: {
          type: 'BINARY_OP',
          left: {
            type: 'LEAF',
            key: 'endpoint.name',
            entity: 'DESTINATION',
            value: 'POST /metrics',
            operator: 'EQUALS'
          },
          right: {
            type: 'LEAF',
            key: 'service.name',
            entity: 'DESTINATION',
            value: 'acceptor',
            operator: 'EQUALS'
          },
          conjunction: 'AND'
        },
        scope: 'INCLUDE_NO_DOWNSTREAM',
        boundaryScope: 'ALL'
      },
      {
        id: 'p6q2GuI_T7egINJfXJWMPw',
        label: 'mary-app',
        matchSpecification: {
          type: 'LEAF',
          key: 'host.ip',
          entity: 'DESTINATION',
          value: '172.17.0.1',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING',
        boundaryScope: 'INBOUND'
      },
      {
        id: 'yDgwRmN6T3aYijq9onDsXg',
        label: 'test ceh 14',
        matchSpecification: {
          type: 'BINARY_OP',
          left: {
            type: 'LEAF',
            key: 'call.http.status',
            entity: 'NOT_APPLICABLE',
            value: '500',
            operator: 'LESS_THAN'
          },
          right: {
            type: 'LEAF',
            key: 'call.http.status',
            entity: 'NOT_APPLICABLE',
            value: '301',
            operator: 'GREATER_THAN'
          },
          conjunction: 'AND'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'ALL'
      },
      {
        id: '4sHPBDCKThq5UptNW9wtVg',
        label: 'app ID example',
        matchSpecification: {
          type: 'LEAF',
          key: 'call.http.params.applicationId',
          entity: 'NOT_APPLICABLE',
          value: 'wGRAg_NmQZmtwENPoB_XZA',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'INBOUND'
      },
      {
        id: '6yt6vb0aTDKIy3-7hMLDiQ',
        label: 'payment service',
        matchSpecification: {
          type: 'LEAF',
          key: 'service.name',
          entity: 'DESTINATION',
          value: 'payment',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'INBOUND'
      },
      {
        id: 'Slqq1mNrQmujWjjAUpy_ow',
        label: 'Geo Test',
        matchSpecification: {
          type: 'LEAF',
          key: 'geo.countryCode',
          entity: 'SOURCE',
          value: 'DE',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING',
        boundaryScope: 'INBOUND'
      },
      {
        id: 'vuo8dVg_TDKxQG07hTGflQ',
        label: 'Demo Database',
        matchSpecification: {
          type: 'LEAF',
          key: 'agent.zone',
          entity: 'DESTINATION',
          value: 'Demo Database',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING',
        boundaryScope: 'INBOUND'
      },
      {
        id: 'G743uUibSVaO2ENlcKm-Xw',
        label: 'Foomium',
        matchSpecification: {
          type: 'LEAF',
          key: 'agent.zone',
          entity: 'DESTINATION',
          value: 'Foomium',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'ALL'
      },
      {
        id: 'ZOPwi7eAT4agWxDrkGcbhw',
        label: 'Another AP',
        matchSpecification: {
          type: 'BINARY_OP',
          left: {
            type: 'LEAF',
            key: 'agent.zone',
            entity: 'DESTINATION',
            value: '',
            operator: 'NOT_EMPTY'
          },
          right: {
            type: 'LEAF',
            key: 'agent.zone',
            entity: 'DESTINATION',
            value: 'Demo Database',
            operator: 'EQUALS'
          },
          conjunction: 'AND'
        },
        scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING',
        boundaryScope: 'INBOUND'
      },
      {
        id: 'kcBaUyUXRmeUWsQwjdmbAA',
        label: 'test ceh8',
        matchSpecification: {
          type: 'BINARY_OP',
          left: {
            type: 'LEAF',
            key: 'kubernetes.namespace',
            entity: 'DESTINATION',
            value: 'eum',
            operator: 'EQUALS'
          },
          right: {
            type: 'LEAF',
            key: 'kubernetes.namespace',
            entity: 'DESTINATION',
            value: 'robot-shop',
            operator: 'EQUALS'
          },
          conjunction: 'OR'
        },
        scope: 'INCLUDE_NO_DOWNSTREAM',
        boundaryScope: 'INBOUND'
      },
      {
        id: 'Y96FsN7QRvOi1MRomk5iBg',
        label: 'test ceh 20',
        matchSpecification: {
          type: 'LEAF',
          key: 'call.http.params.query_id',
          entity: 'NOT_APPLICABLE',
          value: '5063e68e-8fa6-46f2-9e1a-e7083230e87f',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'ALL'
      },
      {
        id: 'acfRC1IqTVi41OMLAJU4Cw',
        label: 'k8s-demo',
        matchSpecification: {
          type: 'LEAF',
          key: 'agent.zone',
          entity: 'DESTINATION',
          value: 'k8s-demo',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING',
        boundaryScope: 'INBOUND'
      },
      {
        id: 'aXFTYl_eRQOkWqk0Hzw8lg',
        label: 'shipping',
        matchSpecification: {
          type: 'LEAF',
          key: 'service.name',
          entity: 'DESTINATION',
          value: 'shipping',
          operator: 'EQUALS'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'INBOUND'
      },
      {
        id: 'i09q4QDpSTaka4oO8Qs8Ow',
        label: '"test ceh 22"',
        matchSpecification: {
          type: 'LEAF',
          key: 'dropwizard.name',
          entity: 'DESTINATION',
          value: '',
          operator: 'NOT_EMPTY'
        },
        scope: 'INCLUDE_ALL_DOWNSTREAM',
        boundaryScope: 'ALL'
      }
    ]
  });

export const getSliConfigurations = () =>
  just({
    data: [
      {
        id: 'availability-sli-test-2',
        sliName: 'Slo on K8s demo',
        initialEvaluationTimestamp: 1596099060000,
        metricConfiguration: null,
        sliEntity: {
          sliType: 'availability',
          applicationId: 'acfRC1IqTVi41OMLAJU4Cw',
          serviceId: null,
          endpointId: null,
          boundaryScope: 'INBOUND',
          goodEventFilters: [
            {
              name: 'call.http.status',
              stringValue: '2',
              numberValue: null,
              booleanValue: null,
              operator: 'STARTS_WITH',
              entity: 'NOT_APPLICABLE'
            }
          ],
          badEventFilters: [
            {
              name: 'call.http.status',
              stringValue: '5',
              numberValue: null,
              booleanValue: null,
              operator: 'STARTS_WITH',
              entity: 'NOT_APPLICABLE'
            }
          ]
        },
        lastUpdated: 1596099059750
      },
      {
        id: 'phani-test-2',
        sliName: 'Slo on K8s-demo',
        initialEvaluationTimestamp: 1594019580000,
        metricConfiguration: {
          metricName: 'latency',
          metricAggregation: 'P90',
          threshold: 25
        },
        sliEntity: {
          sliType: 'application',
          applicationId: 'acfRC1IqTVi41OMLAJU4Cw',
          serviceId: null,
          endpointId: null,
          boundaryScope: 'ALL'
        },
        lastUpdated: 1594106011152
      },
      {
        id: 'phani-test-1',
        sliName: 'Slo on all services500',
        initialEvaluationTimestamp: 1590488520000,
        metricConfiguration: {
          metricName: 'latency',
          metricAggregation: 'P90',
          threshold: 10
        },
        sliEntity: {
          sliType: 'application',
          applicationId: 'btg-B701Rx6o9QNXUS4TVw',
          serviceId: null,
          endpointId: null,
          boundaryScope: 'ALL'
        },
        lastUpdated: 1594105924212
      },
      {
        id: 'availability-sli-test-mary',
        sliName: 'Slo on Eum frontend app',
        initialEvaluationTimestamp: 1596521340000,
        metricConfiguration: null,
        sliEntity: {
          sliType: 'availability',
          applicationId: 'vkDbpw1QTbS3BLg9q526hQ',
          serviceId: null,
          endpointId: null,
          boundaryScope: 'ALL',
          goodEventFilters: [
            {
              name: 'call.http.status',
              stringValue: '2',
              numberValue: null,
              booleanValue: null,
              operator: 'STARTS_WITH',
              entity: 'NOT_APPLICABLE'
            }
          ],
          badEventFilters: [
            {
              name: 'call.http.status',
              stringValue: '5',
              numberValue: null,
              booleanValue: null,
              operator: 'STARTS_WITH',
              entity: 'NOT_APPLICABLE'
            }
          ]
        },
        lastUpdated: 1596528717824
      },
      {
        id: 'availability-sli-test-1',
        sliName: 'Slo on All services',
        initialEvaluationTimestamp: 1596099060000,
        metricConfiguration: null,
        sliEntity: {
          sliType: 'availability',
          applicationId: 'btg-B701Rx6o9QNXUS4TVw',
          serviceId: null,
          endpointId: null,
          boundaryScope: 'INBOUND',
          goodEventFilters: [
            {
              name: 'call.http.status',
              stringValue: '2',
              numberValue: null,
              booleanValue: null,
              operator: 'STARTS_WITH',
              entity: 'NOT_APPLICABLE'
            }
          ],
          badEventFilters: [
            {
              name: 'call.http.status',
              stringValue: '5',
              numberValue: null,
              booleanValue: null,
              operator: 'STARTS_WITH',
              entity: 'NOT_APPLICABLE'
            }
          ]
        },
        lastUpdated: 1596099021530
      },
      {
        id: 'joschi-test-1',
        sliName: 'SLI on all services latency p90 <10ms',
        initialEvaluationTimestamp: 1590488520000,
        metricConfiguration: {
          metricName: 'latency',
          metricAggregation: 'P90',
          threshold: 10
        },
        sliEntity: {
          sliType: 'application',
          applicationId: 'acfRC1IqTVi41OMLAJU4Cw',
          serviceId: null,
          endpointId: null,
          boundaryScope: 'ALL'
        },
        lastUpdated: 1595255364629
      },
      {
        id: 'availability-sli-test-3',
        sliName: 'Slo on Eum frontend app',
        initialEvaluationTimestamp: 1596117600000,
        metricConfiguration: null,
        sliEntity: {
          sliType: 'availability',
          applicationId: 'vkDbpw1QTbS3BLg9q526hQ',
          serviceId: null,
          endpointId: null,
          boundaryScope: 'ALL',
          goodEventFilters: [
            {
              name: 'call.http.status',
              stringValue: '2',
              numberValue: null,
              booleanValue: null,
              operator: 'STARTS_WITH',
              entity: 'NOT_APPLICABLE'
            }
          ],
          badEventFilters: [
            {
              name: 'call.http.status',
              stringValue: '5',
              numberValue: null,
              booleanValue: null,
              operator: 'STARTS_WITH',
              entity: 'NOT_APPLICABLE'
            }
          ]
        },
        lastUpdated: 1596117573516
      }
    ],
    errors: [],
    progress: {
      loading: false
    },
    time: 1597136765973
  });
