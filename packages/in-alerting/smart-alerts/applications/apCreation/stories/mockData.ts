/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export const globalBuitInAlerts = [
  {
    name: 'Erroneous call rate for ${service.name} is high',
    description: 'The erroneous call rate is higher than 50%.',
    boundaryScope: 'INBOUND',
    applications: {
      VTNvC_sATZqMj4vSZfsjKA: {
        applicationId: 'VTNvC_sATZqMj4vSZfsjKA',
        inclusive: true,
        services: {}
      },
      'btg-B701Rx6o9QNXUS4TVw': {
        applicationId: 'btg-B701Rx6o9QNXUS4TVw',
        inclusive: true,
        services: {}
      }
    },
    applicationIds: ['VTNvC_sATZqMj4vSZfsjKA', 'btg-B701Rx6o9QNXUS4TVw'],
    severity: 10,
    triggering: true,
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    },
    includeInternal: false,
    includeSynthetic: false,
    rule: {
      alertType: 'errorRate',
      metricName: 'errors',
      aggregation: 'MEAN'
    },
    threshold: {
      type: 'staticThreshold',
      operator: '>',
      value: 0.5,
      lastUpdated: 0
    },
    alertChannelIds: [],
    granularity: 300000,
    timeThreshold: {
      type: 'requestImpact',
      timeWindow: 300000,
      requests: 20
    },
    evaluationType: 'PER_AP_SERVICE',
    customPayloadFields: [],
    id: '123',
    created: 1624541725873,
    readOnly: false,
    enabled: true,
    builtIn: true,
    tagFilters: []
  },
  {
    name: 'Thiemo - ${service.name} BuiltIn Error Rate Alert Test',
    description: 'Erroneous call rate is higher than normal',
    boundaryScope: 'INBOUND',
    applications: {
      '3wbEPI9LTx-P2XE3Ru4t9w': {
        applicationId: '3wbEPI9LTx-P2XE3Ru4t9w',
        inclusive: true,
        services: {}
      },
      VTNvC_sATZqMj4vSZfsjKA: {
        applicationId: 'VTNvC_sATZqMj4vSZfsjKA',
        inclusive: true,
        services: {}
      },
      'btg-B701Rx6o9QNXUS4TVw': {
        applicationId: 'btg-B701Rx6o9QNXUS4TVw',
        inclusive: true,
        services: {}
      }
    },
    applicationIds: ['3wbEPI9LTx-P2XE3Ru4t9w', 'VTNvC_sATZqMj4vSZfsjKA', 'btg-B701Rx6o9QNXUS4TVw'],
    severity: 5,
    triggering: false,
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'OR',
      elements: []
    },
    includeInternal: false,
    includeSynthetic: false,
    rule: {
      alertType: 'errorRate',
      metricName: 'errors',
      aggregation: 'MEAN'
    },
    threshold: {
      type: 'staticThreshold',
      operator: '>=',
      value: 0.8,
      lastUpdated: 0
    },
    alertChannelIds: [],
    granularity: 300000,
    timeThreshold: {
      type: 'violationsInPeriod',
      timeWindow: 900000,
      violations: 2
    },
    evaluationType: 'PER_AP_SERVICE',
    customPayloadFields: [],
    id: '456',
    created: 1624541725528,
    readOnly: false,
    enabled: false,
    builtIn: true,
    tagFilters: []
  },
  {
    name: 'Thiemo - ${service.name} BuiltIn Error Rate Alert partially selected 1',
    description: 'Erroneous call rate is higher than normal',
    boundaryScope: 'INBOUND',
    applications: {
      'btg-B701Rx6o9QNXUS4TVw': {
        applicationId: 'btg-B701Rx6o9QNXUS4TVw',
        inclusive: false,
        services: {
          '23d600e5868c45da631a52fa6d9344c99ea4b4e3': {
            serviceId: '23d600e5868c45da631a52fa6d9344c99ea4b4e3',
            inclusive: true,
            endpoints: {}
          }
        }
      }
    },
    applicationIds: ['3wbEPI9LTx-P2XE3Ru4t9w', 'VTNvC_sATZqMj4vSZfsjKA', 'btg-B701Rx6o9QNXUS4TVw'],
    severity: 5,
    triggering: false,
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'OR',
      elements: []
    },
    includeInternal: false,
    includeSynthetic: false,
    rule: {
      alertType: 'errorRate',
      metricName: 'errors',
      aggregation: 'MEAN'
    },
    threshold: {
      type: 'staticThreshold',
      operator: '>=',
      value: 0.8,
      lastUpdated: 0
    },
    alertChannelIds: [],
    granularity: 300000,
    timeThreshold: {
      type: 'violationsInPeriod',
      timeWindow: 900000,
      violations: 2
    },
    evaluationType: 'PER_AP_SERVICE',
    customPayloadFields: [],
    id: '789',
    created: 1624541725528,
    readOnly: false,
    enabled: false,
    builtIn: true,
    tagFilters: []
  },
  {
    name: 'Thiemo - ${service.name} BuiltIn Error Rate Alert partially selected 2',
    description: 'Erroneous call rate is higher than normal',
    boundaryScope: 'INBOUND',
    applications: {
      'btg-B701Rx6o9QNXUS4TVw': {
        applicationId: 'btg-B701Rx6o9QNXUS4TVw',
        inclusive: true,
        services: {
          '83c6656d6345730c34ef0bc8a6cb0726a89b63a9': {
            serviceId: '83c6656d6345730c34ef0bc8a6cb0726a89b63a9',
            inclusive: true,
            endpoints: {
              hB04olFRfRipX4vnBaOlUwZhQ9o: {
                endpointId: 'hB04olFRfRipX4vnBaOlUwZhQ9o',
                inclusive: false
              }
            }
          }
        }
      }
    },
    applicationIds: ['3wbEPI9LTx-P2XE3Ru4t9w', 'VTNvC_sATZqMj4vSZfsjKA', 'btg-B701Rx6o9QNXUS4TVw'],
    severity: 5,
    triggering: false,
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'OR',
      elements: []
    },
    includeInternal: false,
    includeSynthetic: false,
    rule: {
      alertType: 'errorRate',
      metricName: 'errors',
      aggregation: 'MEAN'
    },
    threshold: {
      type: 'staticThreshold',
      operator: '>=',
      value: 0.8,
      lastUpdated: 0
    },
    alertChannelIds: [],
    granularity: 300000,
    timeThreshold: {
      type: 'violationsInPeriod',
      timeWindow: 900000,
      violations: 2
    },
    evaluationType: 'PER_AP_SERVICE',
    customPayloadFields: [],
    id: '101112',
    created: 1624541725528,
    readOnly: false,
    enabled: false,
    builtIn: true,
    tagFilters: []
  }
];
