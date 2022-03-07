/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import {
  MetricResult,
  Result,
  TagFilterExpressionElement,
  TimeConfig,
  TimeShift,
  UnifiedMetricConfiguration
} from 'in-types';
import { createChartedMetric, createGroupBy, createMetricField, createOrderBy } from 'in-analyze/navigation/paths';
import getCallGroups, { GetCallGroupsResult } from 'in-applications/subscriptions/getCallGroups';
import ResultAwareBigNumberKpiCard from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { createServiceTagFilter, createServiceTagFilterExpression } from './metricConfigs';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { syntheticCallsOptions } from 'in-applications/constants';
import { hasError, isLoading } from 'in-services/util/result';
import { EntityType } from 'in-analyze/applicationFilter';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export interface GroupBasedBigNumberKpiCardProps {
  title: string;
  resultMapper: (result: GetCallGroupsResult) => Result<MetricResult[]>;
  timeConfig: TimeConfig;
  timeShiftConfig: TimeShift;
  serviceId: string;
  groupByTag: string;
  groupByTagEntity?: EntityType;
  syntheticCalls: string;
  boundaryScope: string;
}

export const groupedBigNumberKpiMapper = (result: GetCallGroupsResult): Result<MetricResult[]> => {
  if (isLoading(result) || hasError(result)) {
    return {
      ...result,
      data: undefined
    };
  }
  return {
    ...result,
    data: [
      {
        id: 'bigNumber',
        values: [[0, result?.data?.totalHits]]
      } as MetricResult
    ]
  };
};

export default function GroupBigNumberKpiCard(props: GroupBasedBigNumberKpiCardProps) {
  const {
    title,
    timeConfig,
    timeShiftConfig,
    serviceId,
    syntheticCalls: urlSyntheticCalls,
    resultMapper,
    boundaryScope,
    groupByTag,
    groupByTagEntity
  } = props;
  const syntheticCalls = urlSyntheticCalls || syntheticCallsOptions.default;

  const serviceFilter = createServiceTagFilter(serviceId);
  const groupBy = createGroupBy(groupByTag, groupByTagEntity);

  const result =
    useObservable(
      getCallGroups({
        group: groupBy,
        metrics: {
          calls_SUM: { metric: 'calls', aggregation: 'SUM' }
        },
        filter: {
          timeConfig,
          includeInternalCalls: false,
          includeSyntheticCalls: false,
          useLongTermDataOnly: false
        },
        order: createOrderBy('group', 'DESC'),
        pagination: {
          cursor: undefined,
          retrievalSize: 200
        },
        includeSynthetic: false,
        includeOthers: false,
        includeInternal: false,
        removeUnmatchedGroup: false,
        timeShift: timeShiftConfig,
        tagFilterExpressionElement: createServiceTagFilterExpression(serviceId) as TagFilterExpressionElement
      }).map(resultMapper),
      []
    ) || pendingResult;

  return (
    <ResultAwareBigNumberKpiCard
      title={title}
      formatter={number.compact}
      config={{
        comparisonDecreaseColor: 'redish',
        comparisonIncreaseColor: 'greenish',
        metricConfiguration: {
          metric: 'calls',
          aggregation: 'SUM',
          source: 'APPLICATION',
          tagFilters: serviceFilter,
          timeConfig,
          timeShift: timeShiftConfig,
          resultType: 'SINGLE_NUMBER'
        } as UnifiedMetricConfiguration
      }}
      iconAction={{
        text: t('in-applications:lineViewInAnalyze'),
        kind: 'subtle',
        icon: 'lib_analyze',
        href$: getJumpToAnalyzeHref$(
          { serviceId },
          {
            timeConfig,
            boundaryScope,
            groupBy,
            formModel: createFormModelFromSyntheticOption(syntheticCalls),
            hiddenCalls: createHiddenCallsFromSyntheticOption(syntheticCalls),
            fields: [createMetricField('erroneousCalls', 'SUM'), createMetricField('latency', 'MEAN')],
            chartedMetrics: [createChartedMetric('calls', 'SUM')]
          }
        )
      }}
      result={result}
    />
  );
}
