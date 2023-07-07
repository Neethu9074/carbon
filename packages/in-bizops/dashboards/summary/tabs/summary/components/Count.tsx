/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TagFilterExpression, TimeShift } from '@instana/types/typeDefinitions';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { number } from 'in-services/formatters/number';
import { integral } from 'in-stores/metric/renderer';
import useTimeConfig from 'in-hooks/useTimeConfig';
import theme from 'in-themes';
import { t } from 'in-i18n';

interface CountProps {
  timeShiftConfig: TimeShift;
  businessProcessName: string;
  businessProcessId: string;
}

interface RenderChartProps {
  timeShiftConfig: TimeShift;
  businessProcessName: string;
  businessProcessId: string;
}

export default function Count({ timeShiftConfig, businessProcessName, businessProcessId }: CountProps) {
  return (
    <RenderChart
      timeShiftConfig={timeShiftConfig}
      businessProcessName={businessProcessName}
      businessProcessId={businessProcessId}
    />
  );
}

const RenderChart = ({ timeShiftConfig, businessProcessName, businessProcessId }: RenderChartProps) => {
  const timeConfig = useTimeConfig();
  const tagFilterExpression: TagFilterExpression = {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: [
      {
        name: 'bpm_process_definition_id',
        operator: 'EQUALS',
        stringValue: businessProcessId,
        entity: NOT_APPLICABLE,
        type: 'TAG_FILTER'
      },
      {
        name: 'bpm_process_definition_name',
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
    timeConfig: timeConfig,
    dataSource: 'BUSINESS_PROCESSES',
    metric: 'started_processes',
    label: businessProcessName,
    color: theme.lib.colors.chart.strokeColors25[0]
  };

  const renderer = integral.id;

  return (
    <UnifiedMetricsChart
      renderHistoricDataIndicator
      title={t('in-bizops:dashboards.summary.widgets.count')}
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
