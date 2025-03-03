/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode } from 'react';

import { MetricResult, Result } from '@instana/types';

import MultiMetricResultAwareBigNumberKpiCard, {
  Config,
  ConfigWithCompanionMetric
} from 'in-kubernetes/components/MultiMetricResultAwareBigNumberKpiCard';
import { GetBigNumberKpiCardResult } from 'in-kubernetes/components/GetBigNumberKpiCardResult';
import { IconAction } from 'in-components/KpiCard/KpiCard';
import { FormatterFn } from 'in-stores/metric/formatters';

export const metricKey = 'bigNumber';
export const companionMetricKey = 'companion';
export const comparisonMetricKey = 'comparison';

export interface MultiMetricsKpiCardProps {
  title: string;
  formatter: Array<FormatterFn>;
  companionFormatter?: FormatterFn;
  useMaxAvailableHeight?: boolean;
  iconAction?: IconAction;
  config: Array<Config | ConfigWithCompanionMetric>;
  actions?: ReactNode;
  dragHandle?: ReactNode;
  raw?: boolean;
}

export default function MultiMetricBigNumberKpiCard({
  title,
  formatter,
  companionFormatter,
  useMaxAvailableHeight,
  iconAction,
  config,
  actions,
  dragHandle,
  raw
}: MultiMetricsKpiCardProps) {
  let resultArray: Array<Result<MetricResult[]>> = [];
  for (let i = 0; i < config.length; i++) {
    resultArray.push(GetBigNumberKpiCardResult({ config: config[i] }));
  }

  return (
    <MultiMetricResultAwareBigNumberKpiCard
      title={title}
      result={resultArray}
      formatter={formatter}
      companionFormatter={companionFormatter}
      useMaxAvailableHeight={useMaxAvailableHeight}
      iconAction={iconAction}
      config={config}
      actions={
        dragHandle || actions ? (
          <>
            {dragHandle}
            {actions}
          </>
        ) : undefined
      }
      raw={raw}
    />
  );
}
