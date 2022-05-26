/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import { createChartedMetric, createMetricField, createOrderBy } from 'in-analyze/navigation/paths';
import DashboardBigNumberCard, {
  BigNumberCardProps,
  increaseIsGood
} from 'in-applications/Dashboards/commonComponents/DashboardBigNumberCard';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { filterByEndpointType } from './includeEndpointTypes';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function CallsBigNumberCard({
  tagFilters,
  endpointTypes,
  syntheticCallsOption,
  timeConfig,
  boundaryScope,
  jumpToAnalyze
}: BigNumberCardProps) {
  const jumpToAnalyzeHref = getJumpToAnalyzeHref$(jumpToAnalyze.ids, {
    timeConfig: timeConfig,
    boundaryScope: boundaryScope,
    groupBy: jumpToAnalyze.groupBy,
    formModel: joinExpressions({
      expressions: [createFormModelFromSyntheticOption(syntheticCallsOption), ...filterByEndpointType(endpointTypes)]
    }),
    hiddenCalls: createHiddenCallsFromSyntheticOption(syntheticCallsOption),
    fields: [createMetricField('calls', 'PER_SECOND'), createMetricField('latency', 'MEAN')],
    orderByGroups: createOrderBy('calls_PER_SECOND', 'DESC'),
    chartedMetrics: [createChartedMetric('calls', 'PER_SECOND')]
  });
  return (
    <DashboardBigNumberCard
      title={t('in-applications:labelCallsPerSecondFull')}
      metric={'calls'}
      aggregation={'PER_SECOND'}
      formatter={number.perSecond.detailed}
      companionMetric={'calls'}
      companionAggregation={'SUM'}
      companionFormatter={(v: number) =>
        t('in-applications:dashboards.callCount', {
          formattedCount: number.compact(v),
          count: v
        })
      }
      comparisonColors={increaseIsGood}
      jumpToAnalyzeHref={jumpToAnalyzeHref}
      tagFilters={tagFilters}
      syntheticCallsOption={syntheticCallsOption}
      timeConfig={timeConfig}
    />
  );
}
