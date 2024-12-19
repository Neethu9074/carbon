/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TagFilter, TimeConfig } from '@instana/types';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { carbonAlert } from 'in-themes/chartColors';
import { bar } from 'in-stores/metric/renderer';
import { t } from 'in-i18n';

interface Props {
  tagFilterExpression: TagFilter;
  cardTitle: string;
  timeConfig: TimeConfig;
  queryPrecision?: string;
  granularity: number;
}

export default function ErroneousRateChart({
  cardTitle,
  tagFilterExpression,
  timeConfig,
  queryPrecision = 'FULL',
  granularity
}: Props): JSX.Element {
  const timeShiftConfig = useTimeShiftConfig();
  const numberofSubtraces: Metric = {
    metric: 'subtraceErrorRate',
    label: t('in-applications:labelErroneousSubtraceRate'),
    aggregation: 'MEAN',
    source: 'SUBTRACE',
    timeConfig: timeConfig,
    granularity: granularity,
    timeShift: 0,
    color: carbonAlert.red60,
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
          formatter: 'percentage.compact'
        },
        type: 'TIME_SERIES',
        primaryContextMenuAction: 'analyze'
      }}
      extendBar
    />
  );
}
