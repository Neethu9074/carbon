/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import ResultAwareBigNumberKpiCard, {
  Config,
  ConfigWithCompanionMetric
} from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { GetBigNumberKpiCardResult } from 'in-components/KpiCard/GetBigNumberKpiCardResult';
import { IconAction } from 'in-components/KpiCard/KpiCard';
import { FormatterFn } from 'in-stores/metric/formatters';
import { MetricResult, Result } from 'in-types';

export const metricKey = 'bigNumber';
export const companionMetricKey = 'companion';
export const comparisonMetricKey = 'comparison';

export interface BigNumberKpiCardProps {
  title: string;
  formatter: FormatterFn;
  companionFormatter?: FormatterFn;
  useMaxAvailableHeight?: boolean;
  iconAction?: IconAction;
  config: Config | ConfigWithCompanionMetric;
  actions?: ReactNode;
  dragHandle?: ReactNode;
  raw?: boolean;
}

export default function BigNumberKpiCard({
  title,
  formatter,
  companionFormatter,
  useMaxAvailableHeight,
  iconAction,
  config,
  actions,
  dragHandle,
  raw
}: BigNumberKpiCardProps) {
  const result: Result<MetricResult[]> = GetBigNumberKpiCardResult({ config });
  return (
    <ResultAwareBigNumberKpiCard
      title={title}
      result={result}
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
        ) : (
          undefined
        )
      }
      raw={raw}
    />
  );
}
