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
  BigNumberCardProps
} from 'in-applications/Dashboards/commonComponents/DashboardBigNumberCard';
import { createChartedMetric, createMetricField, createOrderBy } from 'in-analyze/navigation/paths';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function ErroneousCallsBigNumberCard({
  tagFilters,
  syntheticCallsOption,
  timeConfig,
  boundaryScope,
  jumpToAnalyze
}: BigNumberCardProps) {
  return (
    <DashboardBigNumberCard
      title={t('in-applications:titleErroneousCalls')}
      metric={'erroneousCalls'}
      aggregation={'SUM'}
      formatter={number.compact}
      companionMetric={'errors'}
      companionAggregation={'MEAN'}
      companionFormatter={(v: number) =>
        t('in-applications:dashboards.percentOfCalls', {
          percentage: percentage.detailed(v)
        })
      }
      jumpToAnalyzeHref={getJumpToAnalyzeHref$(jumpToAnalyze.ids, {
        timeConfig,
        boundaryScope,
        groupBy: jumpToAnalyze.groupBy,
        orderByGroups: createOrderBy('errors_MEAN', 'DESC'),
        formModel: createFormModelFromSyntheticOption(syntheticCallsOption),
        facets: { 'call.erroneous': [true] },
        hiddenCalls: createHiddenCallsFromSyntheticOption(syntheticCallsOption),
        fields: [createMetricField('errors', 'MEAN'), createMetricField('latency', 'MEAN')],
        chartedMetrics: [createChartedMetric('errors', 'MEAN')]
      })}
      tagFilters={tagFilters}
      syntheticCallsOption={syntheticCallsOption}
      timeConfig={timeConfig}
    />
  );
}
