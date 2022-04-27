/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import DashboardBigNumberCard, { BigNumberCardProps } from './DashboardBigNumberCard';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { meanLatency } from 'in-services/formatters/number';
import { createOrderBy } from 'in-analyze/navigation/paths';
import { t } from 'in-i18n';

export default function LatencyBigNumberCard({
  tagFilters,
  syntheticCallsOption,
  timeConfig,
  boundaryScope,
  jumpToAnalyze
}: BigNumberCardProps) {
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
      jumpToAnalyzeHref={getJumpToAnalyzeHref$(jumpToAnalyze.ids, {
        timeConfig,
        boundaryScope,
        groupBy: jumpToAnalyze.groupBy,
        formModel: createFormModelFromSyntheticOption(syntheticCallsOption),
        hiddenCalls: createHiddenCallsFromSyntheticOption(syntheticCallsOption),
        orderByGroups: createOrderBy('latency_MEAN', 'DESC')
      })}
      tagFilters={tagFilters}
      syntheticCallsOption={syntheticCallsOption}
      timeConfig={timeConfig}
    />
  );
}
