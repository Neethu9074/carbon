/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { Observable } from '@instana/observables';
import { EndpointType } from '@instana/types';

import { AggregationType, ApplicationMetricConfiguration, Group, TagFilter, TimeConfig } from 'in-types';
import { isSyntheticOption } from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import { GetLabelsProps } from 'in-applications/components/getJumpToAnalyzeHref';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { FormatterFn } from 'in-stores/metric/formatters';
import { t } from 'in-i18n';

interface DashboardBigNumberCardProps {
  title: string;
  metric: string;
  aggregation: AggregationType;
  formatter: FormatterFn;
  companionMetric?: string;
  companionAggregation?: AggregationType;
  companionFormatter?: FormatterFn;
  comparisonColors: ComparisonColors;
  tagFilters: TagFilter[];
  syntheticCallsOption: string;
  timeConfig: TimeConfig;
  jumpToAnalyzeHref: Observable<string>;
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

export default function DashboardBigNumberCard({
  title,
  metric,
  aggregation,
  formatter,
  companionMetric,
  companionAggregation,
  companionFormatter,
  comparisonColors,
  tagFilters,
  syntheticCallsOption,
  timeConfig,
  jumpToAnalyzeHref
}: DashboardBigNumberCardProps) {
  const includeSyntheticCalls = isSyntheticOption(syntheticCallsOption);
  const timeShift = useTimeShiftConfig();

  const metricConfiguration: ApplicationMetricConfiguration = {
    resultType: 'SINGLE_NUMBER',
    timeConfig: timeConfig,
    dataSource: 'CALLS',
    includeInternal: false,
    includeSynthetic: includeSyntheticCalls,
    source: 'APPLICATION',
    tagFilters: tagFilters,
    metric: metric,
    aggregation: aggregation,
    // @ts-ignore
    timeShift: timeShift.offset
  };

  const cardConfiguration = {
    metricConfiguration: metricConfiguration,
    comparisonDecreaseColor: comparisonColors.decreaseColor,
    comparisonIncreaseColor: comparisonColors.increaseColor,
    ...(companionMetric && {
      companionMetricConfiguration: {
        metric: companionMetric,
        aggregation: companionAggregation,
        source: 'APPLICATION',
        tagFilters: tagFilters,
        includeSynthetic: includeSyntheticCalls
      }
    })
  };

  return (
    <BigNumberKpiCard
      title={title}
      formatter={formatter}
      companionFormatter={companionFormatter}
      config={cardConfiguration}
      iconAction={{
        text: t('in-applications:lineViewInAnalyze'),
        kind: 'subtle',
        icon: 'lib_analyze',
        href$: jumpToAnalyzeHref
      }}
    />
  );
}

export interface JumpToAnalyzeConfig {
  ids: GetLabelsProps;
  groupBy: Group;
}

export interface BigNumberCardProps {
  tagFilters: TagFilter[];
  endpointTypes: EndpointType[];
  syntheticCallsOption: string;
  timeConfig: TimeConfig;
  boundaryScope: string;
  jumpToAnalyze: JumpToAnalyzeConfig;
}
