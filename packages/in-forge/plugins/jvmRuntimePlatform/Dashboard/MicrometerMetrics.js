/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { themes } from '@instana/design-tokens';

import { withSiPrefixThreeDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2';
import { t } from 'in-i18n';

export default function MicrometerMetrics({ snapshot, timeConfig, titlePrefix }) {
  return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} specs={SPECS} />;
}

export const SPECS = [
  {
    prefix: 'micrometer.metrics.gauge.',
    type: 'gauge',
    color: themes.default.ids.color.option.pink['500'],
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
    color: themes.default.ids.color.option.pink['500'],
    metrics: [
      {
        label: t('in-forge:plugins.jvmRuntimePlatform.value'),
        formatter: timeByMillisTwoDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.counter.',
    type: 'counter',
    color: themes.default.ids.color.option.green['500'],
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
    color: themes.default.ids.color.option.green['500'],
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
    color: themes.default.ids.color.option.orange['500'],
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
    color: themes.default.ids.color.option.orange['500'],
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
    color: themes.default.ids.color.option.orange['500'],
    metrics: [
      {
        label: t('in-forge:plugins.jvmRuntimePlatform.value'),
        formatter: timeByMillisTwoDecimalPlaces
      }
    ]
  },
  {
    prefix: 'micrometer.metrics.distributionSummary.',
    type: 'distribution',
    color: themes.default.ids.color.option.yellow['500'],
    metrics: [
      {
        label: t('in-forge:plugins.jvmRuntimePlatform.value'),
        formatter: withSiPrefixThreeDecimalPlaces
      }
    ]
  }
];
