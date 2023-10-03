/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TagFilterExpression, TimeConfig, TimeShift } from '@instana/types';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { number } from 'in-services/formatters/number';
import { integral } from 'in-stores/metric/renderer';
import oldTheme from 'in-themes';
import { t } from 'in-i18n';

/*
  This is a common BizOps Count chart component that is used in both the
  individual business process and individual business process activity dashboards

  All props defined here are the common props used in both charts, only unique props
  are passed in by the process and activity implementations to reduce repetition
*/

interface BizOpsCountChartProps {
  timeShiftConfig: TimeShift;
  timeConfig: TimeConfig;
  businessProcessName: string;
  businessProcessId: string;
  businessActivityName?: string;
  metric: string;
  label: string;
  dataSource: string;
}

export default function BizOpsCountChart({
  timeShiftConfig,
  timeConfig,
  businessProcessName,
  businessProcessId,
  businessActivityName,
  metric,
  label,
  dataSource
}: BizOpsCountChartProps) {
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
  if (businessActivityName != undefined && businessActivityName.length > 0) {
    tagFilterExpression.elements.push({
      name: 'bpm_activity_name',
      operator: 'EQUALS',
      stringValue: businessActivityName,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  }
  const renderer = integral.id;
  const metrics: Metric[] = [
    {
      aggregation: 'DISTINCT_COUNT',
      source: 'BIZOPS',
      timeShift: timeShiftConfig.offset,
      timeConfig: timeConfig,
      color: oldTheme.lib.colors.chart.strokeColors25[0],
      tagFilterExpression: tagFilterExpression,
      metric: metric,
      label: label,
      dataSource: dataSource
    }
  ];
  return (
    <UnifiedMetricsChart
      renderHistoricDataIndicator
      title={t('in-bizops:components.count')}
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
          metrics: metrics
        },
        type: 'TIME_SERIES'
      }}
    />
  );
}
