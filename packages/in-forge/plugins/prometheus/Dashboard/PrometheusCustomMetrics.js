/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { themes } from '@instana/design-tokens';

import {
  withSiMultiplyPrefixThreeDecimalPlaces,
  withSiMultiplyPrefixZeroDecimalPlaces
} from 'in-services/formatters/number';
import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import useMetricIds from 'in-infrastructure/hooks/useMetricIds';
import { t } from 'in-i18n';

export default function PrometheusCustomMetrics({ snapshot, timeConfig, titlePrefix }) {
  const snapshotId = snapshot.get('id');
  const metricIdsResult = useMetricIds({ snapshotId, timeConfig });

  if (metricIdsResult.progress?.loading) {
    return <LoadingIndicator />;
  }
  if (metricIdsResult.data) {
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
  type: 'gauge_histogram',
  color: themes.default.ids.color.option.yellow['500'],
  metrics: [
    {
      label: t('in-sdk:dashboard.customMetricsV2.customMetricsLabelValue'),
      formatter: withSiMultiplyPrefixThreeDecimalPlaces
    }
  ]
};

const stateSet = {
  prefix: 'metrics.statesets.',
  type: 'stateset',
  color: themes.default.ids.color.option.blue['500'],
  metrics: [
    {
      label: t('in-sdk:dashboard.customMetricsV2.customMetricsLabelValue'),
      formatter: withSiMultiplyPrefixThreeDecimalPlaces
    }
  ]
};

const info = {
  prefix: 'metrics.infos.',
  type: 'info',
  color: themes.default.ids.color.option.blue['500'],
  metrics: [
    {
      label: t('in-sdk:dashboard.customMetricsV2.customMetricsLabelValue'),
      formatter: withSiMultiplyPrefixThreeDecimalPlaces
    }
  ]
};

const untyped = {
  prefix: 'metrics.untyped.',
  type: 'untyped',
  color: themes.default.ids.color.option.blue['500'],
  metrics: [
    {
      label: t('in-forge:plugins.prometheus.dashboard.value'),
      formatter: withSiMultiplyPrefixThreeDecimalPlaces
    }
  ]
};

const delta = {
  prefix: 'metrics.delta_counters.',
  type: 'delta counter',
  color: themes.default.ids.color.option.green['500'],
  metrics: [
    {
      label: t('in-sdk:dashboard.customMetricsV2.customMetricsLabelDelta'),
      formatter: withSiMultiplyPrefixZeroDecimalPlaces
    }
  ],
  discrete: true
};

export const SPECS = [
  AVAILABLE_SPECS.COUNTER_CUMULATIVE,
  AVAILABLE_SPECS.GAUGE,
  AVAILABLE_SPECS.HISTOGRAM,
  AVAILABLE_SPECS.SUMMARY,
  gaugeHistogram,
  stateSet,
  info,
  untyped,
  delta
];
