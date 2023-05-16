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
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { filterByEndpointType } from './includeEndpointTypes';
import { meanLatency } from 'in-services/formatters/number';
import { createOrderBy } from 'in-analyze/navigation/paths';
import { t } from 'in-i18n';

export default function LatencyBigNumberCard({
  tagFilters,
  endpointTypes,
  syntheticCallsOption,
  timeConfig,
  boundaryScope,
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
          formModel: joinExpressions({
            expressions: [
              createFormModelFromSyntheticOption(syntheticCallsOption),
              ...filterByEndpointType(endpointTypes)
            ]
          }),
          hiddenCalls: createHiddenCallsFromSyntheticOption(syntheticCallsOption),
          orderByGroups: createOrderBy('latency_MEAN', 'DESC')
        },
        getLinkToApplicationAnalyze
      )}
      tagFilters={tagFilters}
      syntheticCallsOption={syntheticCallsOption}
      timeConfig={timeConfig}
    />
  );
}
