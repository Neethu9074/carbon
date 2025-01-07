/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import DashboardBigNumberCard, {
  BigNumberCardProps,
  increaseIsBad
} from 'in-applications/Dashboards/commonComponents/DashboardBigNumberCard';
import { filterByEndpointType } from 'in-applications/Dashboards/commonComponents/includeEndpointTypes';
import { createChartedMetric, createMetricField, createOrderBy } from 'in-analyze/navigation/paths';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function ErroneousCallsBigNumberCard({
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
      timeConfig,
      boundaryScope,
      groupBy: jumpToAnalyze.groupBy,
      orderByGroups: createOrderBy('errors_MEAN', 'DESC'),
      formModel: filterByEndpointType(endpointTypes),
      hiddenCalls: { includeSynthetic: includeSynthetic },
      facets: { 'call.erroneous': [true] },
      fields: [createMetricField('errors', 'MEAN'), createMetricField('latency', 'MEAN')],
      chartedMetrics: [createChartedMetric('errors', 'MEAN')]
    },
    getLinkToApplicationAnalyze
  );
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
      includeSynthetic={includeSynthetic}
      timeConfig={timeConfig}
    />
  );
}
