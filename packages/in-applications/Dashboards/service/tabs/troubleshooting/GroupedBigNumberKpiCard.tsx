/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import {
  ApplicationMetricConfiguration,
  Group,
  MetricResult,
  Result,
  TagFilter,
  TagFilterEntity,
  TimeConfig,
  TimeShift
} from 'in-types';
import {
  createServiceIdTagFilter,
  createTagFilterExpression
} from 'in-applications/Dashboards/service/tabs/troubleshooting/metricConfigs';
import { createChartedMetric, createMetricField, createOrderBy } from 'in-analyze/navigation/paths';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import getCallGroups, { GetCallGroupsResult } from 'in-applications/subscriptions/getCallGroups';
import { and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import ResultAwareBigNumberKpiCard from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { hasError, isLoading } from 'in-services/util/result';
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
  groupByTagSecondLevel?: string;
  groupByTagEntity?: TagFilterEntity;
  tagFilters?: TagFilter[];
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
        values: [[0, result?.data?.totalHits ?? 0]],
        resultPrecisionDetails: result.resultPrecisionDetails
      } as MetricResult
    ]
  };
};

export default function GroupBigNumberKpiCard(props: GroupBasedBigNumberKpiCardProps) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const {
    title,
    timeConfig,
    timeShiftConfig,
    serviceId,
    resultMapper,
    boundaryScope,
    groupByTag,
    groupByTagSecondLevel,
    groupByTagEntity,
    tagFilters = []
  } = props;

  const serviceFilter = createServiceIdTagFilter(serviceId);
  const groupBy = {
    groupbyTag: groupByTag,
    groupbyTagSecondLevelKey: groupByTagSecondLevel,
    groupbyTagEntity: groupByTagEntity
  } as Group;

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
        includeOthers: false,
        includeInternal: false,
        includeSynthetic: false,
        removeUnmatchedGroup: false,
        timeShift: timeShiftConfig,
        tagFilterExpressionElement: createTagFilterExpression(serviceId, ...tagFilters)
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
          tagFilters: [serviceFilter],
          timeConfig,
          timeShift: timeShiftConfig,
          resultType: 'SINGLE_NUMBER',
          dataSource: 'CALLS',
          includeInternal: false
        } as ApplicationMetricConfiguration
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
            formModel: joinExpressions({
              logicalOperator: and,
              expressions: tagFilters
            }),
            fields: [createMetricField('erroneousCalls', 'SUM'), createMetricField('latency', 'MEAN')],
            chartedMetrics: [createChartedMetric('calls', 'SUM')]
          },
          getLinkToApplicationAnalyze
        )
      }}
      result={result}
    />
  );
}
