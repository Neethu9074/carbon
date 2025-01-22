/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { QueryPrecision, TagFilter, TimeConfig } from '@instana/types';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { carbonAlert } from 'in-themes/chartColors';
import { bar } from 'in-stores/metric/renderer';
import { t } from 'in-i18n';

interface Props {
  cardTitle: string;
  tagFilterExpression: TagFilter;
  timeConfig: TimeConfig;
  queryPrecision?: QueryPrecision;
  granularity: number;
}

export default function NumberOfSubtraces({
  cardTitle,
  tagFilterExpression,
  timeConfig,
  queryPrecision = 'FULL',
  granularity
}: Props): JSX.Element {
  const timeShiftConfig = useTimeShiftConfig();
  const numberofSubtraces: Metric = {
    metric: 'subtraces',
    label: t('in-applications:labelNumberOfSubtraces'),
    aggregation: 'SUM',
    source: 'SUBTRACE',
    timeConfig: timeConfig,
    granularity: granularity,
    timeShift: { offset: 0 },
    color: carbonAlert.green50,
    tagFilterExpression,
    queryPrecision
  };

  const metrics = [numberofSubtraces];
  const colors = [numberofSubtraces.color ?? null];
  const renderer = bar.id;
  return (
    <UnifiedMetricsChart
      customChartSkeletonHeight={280}
      renderHistoricDataIndicator
      title={cardTitle}
      automaticallySize={false}
      reverseLegendOrder={timeShiftConfig.offset !== 0}
      reverseTooltipOrder={timeShiftConfig.offset !== 0}
      config={{
        y1: {
          metrics: metrics,
          colors: colors,
          renderer: renderer,
          formatter: 'number.compact'
        },
        type: 'TIME_SERIES',
        primaryContextMenuAction: 'analyze'
      }}
      extendBar
    />
  );
}
