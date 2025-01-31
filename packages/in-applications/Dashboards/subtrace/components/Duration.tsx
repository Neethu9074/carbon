/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SubtraceUnifiedMetricConfiguration, TagFilter, TimeConfig } from '@instana/types';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { latencyFixed } from 'in-services/formatters/number';
import { integral, line } from 'in-stores/metric/renderer';
import { chartColors } from 'in-themes/chartColors';
import { t } from 'in-i18n';

interface Props {
  timeConfig: TimeConfig;
  cardTitle: string;
  tagFilterExpression: TagFilter;
  granularity: number;
}
export default function DurationChart({ timeConfig, cardTitle, tagFilterExpression, granularity }: Props): JSX.Element {
  const defaultMetricConfig: SubtraceUnifiedMetricConfiguration = {
    granularity,
    metric: 'subtraceDuration',
    source: 'SUBTRACE',
    tagFilterExpression,
    timeConfig: timeConfig,
    timeShift: {
      offset: 0
    },
    queryPrecision: 'FULL',
    aggregation: 'P50',
    resultType: 'TIME_SERIES'
  };

  const latencyMetrics = [
    {
      config: defaultMetricConfig,
      aggregation: 'P50',
      label: t('in-mobile-apps:dashboard.tabs.50thLabel'),
      color: chartColors.strokeColors100[0]
    },
    {
      config: defaultMetricConfig,
      aggregation: 'P90',
      label: t('in-mobile-apps:dashboard.tabs.90thLabel'),
      color: chartColors.strokeColors100[1]
    },
    {
      config: defaultMetricConfig,
      aggregation: 'P95',
      label: t('in-mobile-apps:dashboard.tabs.95thLabel'),
      color: chartColors.strokeColors100[2]
    },
    {
      config: defaultMetricConfig,
      aggregation: 'P99',
      label: t('in-mobile-apps:dashboard.tabs.99thLabel'),
      color: chartColors.strokeColors100[3]
    },
    {
      config: defaultMetricConfig,
      aggregation: 'MAX',
      label: t('in-mobile-apps:dashboard.tabs.maxLabel'),
      color: chartColors.strokeColors100[4]
    }
  ];

  const latencyMetricsY2 = [
    {
      config: defaultMetricConfig,
      aggregation: 'MEAN',
      label: t('in-mobile-apps:dashboard.tabs.meanLabel'),
      color: chartColors.strokeColors100[5]
    }
  ];
  const metricConfigs = latencyMetrics.map(m => ({
    ...m.config,
    label: m.label,
    aggregation: m.aggregation
  })) as Metric[];
  const colors = latencyMetrics.map(m => m.color);
  const colorsY2 = latencyMetricsY2.map(m => m.color);
  const renderer = integral.id;
  const metricConfigsY2 = latencyMetricsY2.map(m => ({
    ...m.config,
    label: m.label,
    aggregation: m.aggregation
  })) as Metric[];
  return (
    <UnifiedMetricsChart
      renderHistoricDataIndicator
      customChartSkeletonHeight={280}
      title={cardTitle}
      timeConfig={timeConfig}
      automaticallySize={false}
      reverseTooltipOrder
      shareMaxAxisDomain
      config={{
        y1: {
          renderer: renderer,
          formatter: 'millis.compact',
          tooltipFormatter: latencyFixed.compact,
          calculateStackDifferences: true,
          metrics: metricConfigs,
          colors: colors
        },
        y2: {
          metrics: metricConfigsY2,
          formatter: 'millis.compact',
          renderer: line.id,
          colors: colorsY2
        },
        type: 'TIME_SERIES'
      }}
    />
  );
}
