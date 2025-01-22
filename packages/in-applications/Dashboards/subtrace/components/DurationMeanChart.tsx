/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TagFilter, TimeConfig } from '@instana/types';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { integral } from 'in-stores/metric/renderer';
import { carbonAlert } from 'in-themes/chartColors';
import { t } from 'in-i18n';

interface Props {
  cardTitle: string;
  tagFilterExpression: TagFilter;
  timeConfig: TimeConfig;
  queryPrecision?: string;
  granularity: number;
}

export default function DurationMeanChart({
  cardTitle,
  tagFilterExpression,
  timeConfig,
  queryPrecision = 'FULL',
  granularity
}: Props): JSX.Element {
  const numberofSubtraces: Metric = {
    metric: 'subtraceDuration',
    label: t('in-applications:labelDuration'),
    aggregation: 'MEAN',
    source: 'SUBTRACE',
    timeConfig: timeConfig,
    granularity: granularity,
    timeShift: { offset: 0 },
    color: carbonAlert.red60,
    tagFilterExpression,
    queryPrecision
  };

  const metrics: Metric[] = [numberofSubtraces];
  const renderer = integral.id;
  const colors = [numberofSubtraces.color ?? null];

  return (
    <UnifiedMetricsChart
      customChartSkeletonHeight={280}
      renderHistoricDataIndicator
      title={cardTitle}
      automaticallySize={false}
      config={{
        y1: {
          metrics: metrics,
          colors: colors,
          renderer: renderer,
          formatter: 'latency.detailed'
        },
        type: 'TIME_SERIES',
        primaryContextMenuAction: 'analyze'
      }}
      extendBar
    />
  );
}
