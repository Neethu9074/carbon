/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import DashboardBigNumberCard, {
  BigNumberCardProps,
  increaseIsBad
} from 'in-applications/Dashboards/commonComponents/DashboardBigNumberCard';
import { createChartedMetric, createMetricField, createOrderBy } from 'in-analyze/navigation/paths';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { number, percentage } from 'in-services/formatters/number';
import { filterByEndpointType } from './includeEndpointTypes';
import { t } from 'in-i18n';

export default function ErroneousCallsBigNumberCard({
  tagFilters,
  endpointTypes,
  syntheticCallsOption,
  timeConfig,
  boundaryScope,
  jumpToAnalyze
}: BigNumberCardProps) {
  const jumpToAnalyzeHref = getJumpToAnalyzeHref$(jumpToAnalyze.ids, {
    timeConfig,
    boundaryScope,
    groupBy: jumpToAnalyze.groupBy,
    orderByGroups: createOrderBy('errors_MEAN', 'DESC'),
    formModel: joinExpressions({
      expressions: [createFormModelFromSyntheticOption(syntheticCallsOption), ...filterByEndpointType(endpointTypes)]
    }),
    facets: { 'call.erroneous': [true] },
    hiddenCalls: createHiddenCallsFromSyntheticOption(syntheticCallsOption),
    fields: [createMetricField('errors', 'MEAN'), createMetricField('latency', 'MEAN')],
    chartedMetrics: [createChartedMetric('errors', 'MEAN')]
  });
  return (
    <DashboardBigNumberCard
      title={t('in-applications:titleErroneousCallRate')}
      metric={'errors'}
      aggregation={'MEAN'}
      formatter={percentage.detailed}
      companionMetric={'erroneousCalls'}
      companionAggregation={'SUM'}
      companionFormatter={(v: number) =>
        t('in-applications:dashboards.erroneousCallCount', {
          formattedCount: number.compact(v),
          count: v
        })
      }
      comparisonColors={increaseIsBad}
      jumpToAnalyzeHref={jumpToAnalyzeHref}
      tagFilters={tagFilters}
      syntheticCallsOption={syntheticCallsOption}
      timeConfig={timeConfig}
    />
  );
}
