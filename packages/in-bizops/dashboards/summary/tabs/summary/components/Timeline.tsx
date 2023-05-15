/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TagFilterExpression, TimeShift } from '@instana/types/typeDefinitions';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { businessProcessDashboard } from 'in-bizops/navigation/paths';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { number } from 'in-services/formatters/number';
import { integral } from 'in-stores/metric/renderer';
import theme from 'in-themes';
import { t } from 'in-i18n';

interface TimelineProps {
  timeShiftConfig: TimeShift;
}

interface RenderChartProps {
  timeShiftConfig: TimeShift;
  businessProcessName: string;
}

export default function Timeline({ timeShiftConfig }: TimelineProps) {
  const location = useLocation();
  const businessProcessName: string =
    getMatrixParameter(location, businessProcessDashboard, 'name') ?? t('in-bizops:dashboards.summary.pageTitle');

  return <RenderChart timeShiftConfig={timeShiftConfig} businessProcessName={businessProcessName} />;
}

const RenderChart = ({ timeShiftConfig, businessProcessName }: RenderChartProps) => {
  const tagFilterExpression: TagFilterExpression = {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: [
      {
        name: 'bpm_process_name',
        operator: 'EQUALS',
        stringValue: businessProcessName,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      }
    ]
  };

  const bizopsMetricConfig: Metric[] = [];
  bizopsMetricConfig[0] = {
    aggregation: 'DISTINCT_COUNT',
    source: 'BIZOPS',
    tagFilterExpression: tagFilterExpression,
    timeShift: timeShiftConfig.offset,
    metric: 'bpm_root_process_id',
    label: t('in-bizops:dashboards.summary.widgets.businessProcessStartedLabel', {
      businessProcessName: businessProcessName
    }),
    color: theme.lib.colors.chart.strokeColors25[0]
  };

  const renderer = integral.id;

  return (
    <UnifiedMetricsChart
      renderHistoricDataIndicator
      title={t('in-bizops:dashboards.summary.widgets.timeline')}
      automaticallySize={false}
      reverseLegendOrder={Boolean(timeShiftConfig.offset)}
      reverseTooltipOrder
      shareMaxAxisDomain
      config={{
        y1: {
          renderer: renderer,
          formatter: 'number.compact',
          tooltipFormatter: number.compact,
          calculateStackDifferences: true,
          metrics: bizopsMetricConfig
        },
        type: 'TIME_SERIES'
      }}
    />
  );
};
