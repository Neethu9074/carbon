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
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { createChartedMetric, createMetricField } from 'in-analyze/navigation/paths';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { perSecondAggregationEnabled } from 'in-services/featureFlags';
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
    fields: [createMetricField('erroneousCalls', 'SUM'), createMetricField('latency', 'MEAN')],
    chartedMetrics: [createChartedMetric('calls', 'SUM')]
  });
  if (perSecondAggregationEnabled) {
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
        jumpToAnalyzeHref={jumpToAnalyzeHref}
        tagFilters={tagFilters}
        syntheticCallsOption={syntheticCallsOption}
        timeConfig={timeConfig}
      />
    );
  } else {
    return (
      <DashboardBigNumberCard
        title={t('in-applications:labelCalls')}
        metric={'calls'}
        aggregation={'SUM'}
        formatter={number.compact}
        jumpToAnalyzeHref={jumpToAnalyzeHref}
        tagFilters={tagFilters}
        syntheticCallsOption={syntheticCallsOption}
        timeConfig={timeConfig}
      />
    );
  }
}
