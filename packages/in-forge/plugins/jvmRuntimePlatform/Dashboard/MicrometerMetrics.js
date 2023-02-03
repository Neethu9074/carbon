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
import { t } from 'in-i18n';

export default function MicrometerMetrics({ snapshot, timeConfig, titlePrefix }) {
  return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} specs={SPECS} />;
}

export const SPECS = [
  {
    prefix: 'micrometer.metrics.gauge.',
    type: 'gauge',
    color: '#D90368',
    metrics: [
      {
        label: t('in-forge:plugins.jvmRuntimePlatform.value'),
        formatter: withSiPrefixThreeDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.timeGauge.',
    type: 'time gauge',
    color: '#D90368',
    metrics: [
      {
        label: t('in-forge:plugins.jvmRuntimePlatform.value'),
        formatter: withSiPrefixThreeDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.counter.',
    type: 'counter',
    color: '#00CC66',
    metrics: [
      {
        label: t('in-forge:plugins.jvmRuntimePlatform.count'),
        formatter: withSiPrefixThreeDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.functionCounter.',
    type: 'function counter',
    color: '#00CC66',
    metrics: [
      {
        label: t('in-forge:plugins.jvmRuntimePlatform.count'),
        formatter: withSiPrefixThreeDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.timer.',
    type: 'timer',
    color: '#F75C03',
    metrics: [
      {
        label: t('in-forge:plugins.jvmRuntimePlatform.value'),
        formatter: timeByMillisTwoDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.functionTimer.',
    type: 'function timer',
    color: '#F75C03',
    metrics: [
      {
        label: t('in-forge:plugins.jvmRuntimePlatform.value'),
        formatter: timeByMillisTwoDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.longTaskTimer.',
    type: 'long task timer',
    color: '#F75C03',
    metrics: [
      {
        label: t('in-forge:plugins.jvmRuntimePlatform.value'),
        formatter: withSiPrefixZeroDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.distributionSummary.',
    type: 'distribution',
    color: '#f7b320',
    metrics: [
      {
        label: t('in-forge:plugins.jvmRuntimePlatform.value'),
        formatter: withSiPrefixThreeDecimalPlaces
      }
    ]
  }
];
