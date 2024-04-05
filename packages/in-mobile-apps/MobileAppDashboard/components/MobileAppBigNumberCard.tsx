/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { AggregationType, MobileAppMetricConfiguration, TagFilter, TimeConfig } from 'in-types';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { IconAction } from 'in-components/KpiCard/KpiCard';
import { FormatterFn } from 'in-stores/metric/formatters';

interface MobileAppBigNumberCardProps {
  title: string;
  metric: string;
  aggregation: AggregationType;
  formatter: FormatterFn;
  companionMetric?: string;
  companionAggregation?: AggregationType;
  companionFormatter?: FormatterFn;
  comparisonColors?: ComparisonColors;
  tagFilters: TagFilter[];
  timeConfig: TimeConfig;
  iconAction: IconAction;
}

interface ComparisonColors {
  decreaseColor: string;
  increaseColor: string;
}

export const increaseIsBad: ComparisonColors = {
  decreaseColor: 'greenish',
  increaseColor: 'redish'
};

export const increaseIsGood: ComparisonColors = {
  decreaseColor: 'redish',
  increaseColor: 'greenish'
};

export default function MobileAppBigNumberCard({
  title,
  metric,
  aggregation,
  formatter,
  companionMetric,
  companionAggregation,
  companionFormatter,
  comparisonColors,
  tagFilters,
  timeConfig,
  iconAction
}: MobileAppBigNumberCardProps) {
  const timeShift = useTimeShiftConfig();

  const metricConfiguration: MobileAppMetricConfiguration = {
    resultType: 'SINGLE_NUMBER',
    timeConfig: timeConfig,
    source: 'MOBILE_APP',
    tagFilters: tagFilters,
    metric: metric,
    aggregation: aggregation,
    // @ts-expect-error
    timeShift: timeShift.offset
  };

  const cardConfiguration = {
    metricConfiguration: metricConfiguration,
    comparisonDecreaseColor: comparisonColors?.decreaseColor,
    comparisonIncreaseColor: comparisonColors?.increaseColor,
    ...(companionMetric && {
      companionMetricConfiguration: {
        metric: companionMetric,
        aggregation: companionAggregation,
        source: 'MOBILE_APP',
        tagFilters: tagFilters
      }
    })
  };

  return (
    <BigNumberKpiCard
      title={title}
      formatter={formatter}
      companionFormatter={companionFormatter}
      config={cardConfiguration}
      iconAction={iconAction}
    />
  );
}
