/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import DashboardBigNumberCard, { BigNumberCardProps } from './DashboardBigNumberCard';
import { createChartedMetric, createMetricField } from 'in-analyze/navigation/paths';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function CallsBigNumberCard({
  tagFilters,
  syntheticCallsOption,
  timeConfig,
  boundaryScope,
  jumpToAnalyze
}: BigNumberCardProps) {
  return (
    <DashboardBigNumberCard
      title={t('in-applications:labelCalls')}
      metric={'calls'}
      aggregation={'SUM'}
      formatter={number.compact}
      jumpToAnalyzeHref={getJumpToAnalyzeHref$(jumpToAnalyze.ids, {
        timeConfig: timeConfig,
        boundaryScope: boundaryScope,
        groupBy: jumpToAnalyze.groupBy,
        formModel: createFormModelFromSyntheticOption(syntheticCallsOption),
        hiddenCalls: createHiddenCallsFromSyntheticOption(syntheticCallsOption),
        fields: [createMetricField('erroneousCalls', 'SUM'), createMetricField('latency', 'MEAN')],
        chartedMetrics: [createChartedMetric('calls', 'SUM')]
      })}
      tagFilters={tagFilters}
      syntheticCallsOption={syntheticCallsOption}
      timeConfig={timeConfig}
    />
  );
}
