/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  withSiPrefixThreeDecimalPlaces,
  timeByMillisTwoDecimalPlaces,
  withSiPrefixZeroDecimalPlaces
} from 'in-services/formatters/number';
import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2';

export default function MicrometerMetrics({ snapshot, timeConfig, titlePrefix }) {
  return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} specs={SPECS} />;
}

export const SPECS = [
  {
    prefix: 'micrometer.metrics.gauge.',
    path: ['data', 'micrometer.metrics.gauge'],
    type: 'gauge',
    color: '#D90368',
    metrics: [
      {
        label: 'Value',
        formatter: withSiPrefixThreeDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.timeGauge.',
    path: ['data', 'micrometer.metrics.timeGauge'],
    type: 'time gauge',
    color: '#D90368',
    metrics: [
      {
        label: 'Value',
        formatter: withSiPrefixThreeDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.counter.',
    path: ['data', 'micrometer.metrics.counter'],
    type: 'counter',
    color: '#00CC66',
    metrics: [
      {
        label: 'Count',
        formatter: withSiPrefixThreeDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.functionCounter.',
    path: ['data', 'micrometer.metrics.functionCounter'],
    type: 'function counter',
    color: '#00CC66',
    metrics: [
      {
        label: 'Count',
        formatter: withSiPrefixThreeDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.timer.',
    path: ['data', 'micrometer.metrics.timer'],
    type: 'timer',
    color: '#F75C03',
    metrics: [
      {
        label: 'Value',
        formatter: timeByMillisTwoDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.functionTimer.',
    path: ['data', 'micrometer.metrics.functionTimer'],
    type: 'function timer',
    color: '#F75C03',
    metrics: [
      {
        label: 'Value',
        formatter: timeByMillisTwoDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.longTaskTimer.',
    path: ['data', 'micrometer.metrics.longTaskTimer'],
    type: 'long task timer',
    color: '#F75C03',
    metrics: [
      {
        label: 'Value',
        formatter: withSiPrefixZeroDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.distributionSummary.',
    path: ['data', 'micrometer.metrics.distributionSummary'],
    type: 'distribution',
    color: '#f7b320',
    metrics: [
      {
        label: 'Value',
        formatter: withSiPrefixThreeDecimalPlaces
      }
    ]
  }
];
