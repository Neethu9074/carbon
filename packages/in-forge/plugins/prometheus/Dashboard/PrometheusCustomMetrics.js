/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import { withSiMultiplyPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { t } from 'in-i18n';

export default function PrometheusCustomMetrics({ snapshot, timeConfig, titlePrefix }) {
  const metricIds = snapshot.get('metricIds');
  if (metricIds.size > 0) {
    return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} specs={SPECS} />;
  } else {
    return (
      <DashboardNotification>
        {t('in-forge:plugins.prometheus.dashboard.noMetricsPrometheusEndpoint')}
      </DashboardNotification>
    );
  }
}

const gaugeHistogram = {
    prefix: 'metrics.gauge_histograms.',
    path: ['data', 'metrics.gauge_histograms'],
    type: 'gauge_histogram',
    color: '#F1C40F',
    metrics: [
      {
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableValue'),
        formatter: withSiMultiplyPrefixThreeDecimalPlaces
      }
    ]
};

const stateSet = {
  prefix: 'metrics.statesets.',
  path: ['data', 'metrics.statesets'],
  type: 'stateset',
  color: '#2274A5',
  metrics: [
    {
      label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableValue'),
      formatter: withSiMultiplyPrefixThreeDecimalPlaces,
    }
  ]
};

const info = {
  prefix: 'metrics.infos.',
  path: ['data', 'metrics.infos'],
  type: 'info',
  color: '#2274A5',
  metrics: [
    {
      label: t('in-sdk:dashboard.customMetricsV2.customMetricsLableValue'),
      formatter: withSiMultiplyPrefixThreeDecimalPlaces,
    }
  ]
};

const untyped = {
  prefix: 'metrics.untyped.',
  path: ['data', 'metrics.untyped'],
  type: 'untyped',
  color: '#2274A5',
  metrics: [
    {
      label: t('in-forge:plugins.prometheus.dashboard.value'),
      formatter: withSiMultiplyPrefixThreeDecimalPlaces
    }
  ]
};

export const SPECS = [
  AVAILABLE_SPECS.COUNTER,
  AVAILABLE_SPECS.GAUGE,
  AVAILABLE_SPECS.HISTOGRAM,
  AVAILABLE_SPECS.SUMMARY,
  gaugeHistogram,
  stateSet,
  info,
  untyped
];
