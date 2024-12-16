/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';

import { InfraMetricConfiguration, UnifiedMetricConfigurationUnion } from '@instana/types';

import { Config, ConfigWithCompanionMetric } from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { getFormatter } from 'in-stores/metric/formatters';
import useTimeConfig from 'in-hooks/useTimeConfig';

export interface BigNumberProps {
  title: string;
  useMaxAvailableHeight?: boolean;
  config: Config<UnifiedMetricConfigurationUnion> | ConfigWithCompanionMetric<UnifiedMetricConfigurationUnion>;
  actions?: ReactNode;
  dragHandle?: ReactNode;
  isPreview?: boolean;
  formatter?: string;
  metricName: string;
  tagFilter: string;
}

export default function TotalUsageBigNumber({
  title,
  metricName,
  tagFilter,
  formatter,
  actions,
  dragHandle,
  isPreview
}: BigNumberProps) {
  const timeConfig = useTimeConfig();
  const timeShiftConfig = useTimeShiftConfig();

  const config: Config<InfraMetricConfiguration> = {
    formatter: formatter,
    metricConfiguration: {
      aggregation: 'SUM',
      metric: metricName,
      source: 'INFRASTRUCTURE_METRICS',
      timeShift: timeShiftConfig,
      tagFilterExpression: {
        name: 'otel.attribute.service.instance.id',
        type: 'TAG_FILTER',
        value: tagFilter,
        entity: 'NOT_APPLICABLE',
        operator: 'EQUALS'
      },
      crossSeriesAggregation: 'SUM',
      type: 'oTelLLM',
      regex: false,
      timeConfig: timeConfig,
      resultType: 'SINGLE_NUMBER'
    }
  };
  return (
    <BigNumberKpiCard
      config={config}
      title={title}
      actions={actions}
      dragHandle={dragHandle}
      useMaxAvailableHeight={!isPreview}
      formatter={getFormatter(config.formatter)}
    />
  );
}
