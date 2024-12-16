/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import { Result } from '@instana/types';

import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import InfraAlertChartWrapper from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';

jest.mock('in-infrastructure/Explore/Explore', () => ({
  getUniqueMetricsAndLabels: jest.fn(() => [
    { aggregation: 'MEAN', metric: 'threads.lck_crs', label: 'Contention-Rate' }
  ])
}));

const metricResult = {
  data: [
    {
      id: 'y1-0',
      values: [
        [1722253800000, 0.1502],
        [1722254400000, 0.2627],
        [1722255000000, 0.1541],
        [1722255600000, 0.8247]
      ],
      resultPrecisionDetails: null,
      adjustedTimeframe: {
        windowSize: 600000,
        to: 1722340200000
      },
      granularity: null
    }
  ],
  errors: [],
  time: 1722340800001,
  progress: {
    loading: false
  }
} as unknown as Result<UnifiedMetricsResult[]>;
const companionMetricResult = {
  data: [],
  errors: [],
  time: 0,
  progress: {
    loading: false
  }
} as unknown as Result<UnifiedMetricsResult[]>;

jest.mock('in-custom-dashboards/widgets/Chart/UnifiedMetricsChart', () => ({
  useResultData: jest.fn(() => {
    return { metricResult, companionMetricResult };
  })
}));

describe('in-alerting/components/InfraAlertChartWrapper', () => {
  it('renders component correctly', () => {
    const alertConfig = {
      alertChannelIds: [],
      description: '',
      granularity: 600000,
      groupBy: [],
      name: '',
      forecastingConfig: null,
      tagFilterExpression: {
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: []
      },
      rule: {
        alertType: 'genericRule',
        entityType: 'clrRuntimePlatform',
        metricName: 'threads.lck_crs',
        aggregation: 'MEAN',
        regex: false
      },
      timeThreshold: {
        type: 'violationsInSequence',
        timeWindow: 600000
      },
      customPayloadFields: [],
      rules: [
        {
          rule: {
            alertType: 'genericRule',
            entityType: 'clrRuntimePlatform',
            metricName: 'threads.lck_crs',
            aggregation: 'MEAN',
            regex: false
          },
          thresholdOperator: '>=',
          thresholds: {
            WARNING: {
              type: 'staticThreshold',
              value: 7
            },
            CRITICAL: {
              type: 'staticThreshold',
              value: 9
            }
          }
        }
      ]
    } as unknown as InfraSmartAlertConfigWithMetadata;

    const props = {
      alertConfig,
      timeConfig: { autoRefresh: false, windowSize: 86400000 },
      metricLabel: 'Contention-Rate',
      alertsPreviewEnabled: true
    };

    const { container } = render(<InfraAlertChartWrapper {...props} />);

    expect(container.getElementsByClassName('local-css-chart').length).toBe(1);
    expect(container.getElementsByClassName('local-css-markerLanesWrapper').length).toBe(1);
    expect(container.getElementsByClassName('local-css-chartAxisWrapper').length).toBe(1);
    expect(container.getElementsByClassName('local-css-canvas').length).toBe(1);
  });
});
