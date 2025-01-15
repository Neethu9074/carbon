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
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { createChartedMetric, createOrderBy } from 'in-analyze/navigation/paths';
import { meanLatency } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function LatencyBigNumberCard({
  tagFilters,
  endpointTypes,
  timeConfig,
  boundaryScope,
  includeSynthetic,
  jumpToAnalyze
}: BigNumberCardProps) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  return (
    <DashboardBigNumberCard
      title={t('in-applications:titleMeanLatency')}
      metric={'latency'}
      aggregation={'MEAN'}
      formatter={meanLatency.detailed}
      companionMetric={'latency'}
      companionAggregation={'P90'}
      companionFormatter={(v: number) =>
        t('in-applications:dashboards.meanLatencyFor90th', {
          meanLatencyDetail: meanLatency.detailed(v)
        })
      }
      comparisonColors={increaseIsBad}
      jumpToAnalyzeHref={getJumpToAnalyzeHref$(
        jumpToAnalyze.ids,
        {
          timeConfig,
          boundaryScope,
          groupBy: jumpToAnalyze.groupBy,
          formModel: filterByEndpointType(endpointTypes),
          hiddenCalls: { includeSynthetic: includeSynthetic },
          orderByGroups: createOrderBy('latency_MEAN', 'DESC'),
          chartedMetrics: [createChartedMetric('latency', 'MEAN')]
        },
        getLinkToApplicationAnalyze
      )}
      tagFilters={tagFilters}
      includeSynthetic={includeSynthetic}
      timeConfig={timeConfig}
    />
  );
}
