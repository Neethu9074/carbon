/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import DashboardBigNumberCard, {
  BigNumberCardProps,
  increaseIsGood
} from 'in-applications/Dashboards/commonComponents/DashboardBigNumberCard';
import { filterByEndpointType } from 'in-applications/Dashboards/commonComponents/includeEndpointTypes';
import { createChartedMetric, createMetricField, createOrderBy } from 'in-analyze/navigation/paths';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function CallsBigNumberCard({
  tagFilters,
  endpointTypes,
  timeConfig,
  boundaryScope,
  includeSynthetic,
  jumpToAnalyze
}: BigNumberCardProps) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  const jumpToAnalyzeHref = getJumpToAnalyzeHref$(
    jumpToAnalyze.ids,
    {
      timeConfig: timeConfig,
      boundaryScope: boundaryScope,
      groupBy: jumpToAnalyze.groupBy,
      formModel: filterByEndpointType(endpointTypes),
      hiddenCalls: { includeSynthetic: includeSynthetic },
      fields: [createMetricField('calls', 'PER_SECOND'), createMetricField('latency', 'MEAN')],
      orderByGroups: createOrderBy('calls_PER_SECOND', 'DESC'),
      chartedMetrics: [createChartedMetric('calls', 'PER_SECOND')]
    },
    getLinkToApplicationAnalyze
  );
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
      includeSynthetic={includeSynthetic}
      timeConfig={timeConfig}
    />
  );
}
