/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TagFilterExpression } from '@instana/types';

import { businessActivityPath, businessProcessDashboard } from 'in-bizops/navigation/paths';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getChartGranularity } from 'in-stores/metric/metric';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { latencyFixed } from 'in-services/formatters/number';
import { AxisColor } from 'in-components/Chart/types';
import { integral } from 'in-stores/metric/renderer';
import { chartColors } from 'in-themes/chartColors';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

type DurationOverTimeProps = {
  rightHeaderContent: React.ReactElement;
};

export default function DurationOverTime({ rightHeaderContent }: DurationOverTimeProps) {
  const timeConfig = useTimeConfig();
  const timeShiftConfig = useTimeShiftConfig();
  const granularity = getChartGranularity(timeConfig);

  const location = useLocation();
  const businessProcessId: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionId') ??
    t('in-bizops:dashboards.summary.pageTitle');
  const businessProcessName: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionName') ??
    t('in-bizops:dashboards.summary.pageTitle');
  const businessActivityName: string =
    getMatrixParameter(location, businessActivityPath, 'activityName') ?? t('in-bizops:dashboards.summary.pageTitle');

  const tagFilters: TagFilterExpression = {
    logicalOperator: 'AND',
    type: 'EXPRESSION',
    elements: [
      {
        name: 'bpm_process_definition_id',
        operator: 'EQUALS',
        stringValue: businessProcessId,
        entity: 'NOT_APPLICABLE',
        type: 'TAG_FILTER'
      },
      {
        name: 'bpm_process_definition_name',
        operator: 'EQUALS',
        stringValue: businessProcessName,
        entity: 'NOT_APPLICABLE',
        type: 'TAG_FILTER'
      },
      {
        name: 'bpm_activity_name',
        operator: 'EQUALS',
        stringValue: businessActivityName,
        entity: 'NOT_APPLICABLE',
        type: 'TAG_FILTER'
      }
    ]
  };

  const defaultMetricConfig = {
    granularity,
    metric: 'activityDuration',
    source: 'BIZOPS',
    tagFilterExpression: tagFilters,
    timeConfig: timeConfig,
    timeShift: 0
  } as const

  const durationMetrics: Metric[] = [
    {
      ...defaultMetricConfig,
      aggregation: 'P50',
      label: t('in-mobile-apps:dashboard.tabs.50thLabel'),
      color: chartColors.strokeColors25[0]
    },
    {
      ...defaultMetricConfig,
      aggregation: 'P90',
      label: t('in-mobile-apps:dashboard.tabs.90thLabel'),
      color: chartColors.strokeColors25[1]
    },
    {
      ...defaultMetricConfig,
      aggregation: 'P95',
      label: t('in-mobile-apps:dashboard.tabs.95thLabel'),
      color: chartColors.strokeColors25[2]
    },
    {
      ...defaultMetricConfig,
      aggregation: 'P99',
      label: t('in-mobile-apps:dashboard.tabs.99thLabel'),
      color: chartColors.strokeColors25[3]
    },
    {
      ...defaultMetricConfig,
      aggregation: 'MAX',
      label: t('in-mobile-apps:dashboard.tabs.maxLabel'),
      color: chartColors.strokeColors25[4],
      defaultDisabled: !timeShiftConfig.offset
    },
    {
      ...defaultMetricConfig,
      aggregation: 'MEAN',
      label: t('in-mobile-apps:dashboard.tabs.meanLabel'),
      color: chartColors.strokeColors25[5],
      defaultDisabled: !timeShiftConfig.offset
    }
  ];

  const colors: AxisColor[] = durationMetrics.map(m => m.color as string);

  return (
    <UnifiedMetricsChart
      title={t('in-bizops:dashboards.activity.widgets.duration')}
      rightHeaderContent={rightHeaderContent}
      timeConfig={timeConfig}
      renderHistoricDataIndicator
      customChartSkeletonHeight={280}
      config={{
        y1: {
          renderer: integral.id,
          formatter: 'millis.compact',
          tooltipFormatter: latencyFixed.compact,
          calculateStackDifferences: true,
          metrics: durationMetrics,
          colors: colors
        },
        y2: {
          metrics: []
        },
        type: 'TIME_SERIES'
      }}
    />
  );
}
