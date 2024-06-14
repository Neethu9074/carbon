/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  PER_AP,
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { getSingleNumberMetricId } from 'in-components/AnalyzeView/metrics';
import getCallGroups from 'in-applications/subscriptions/getCallGroups';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import useCursorPagination from 'in-hooks/useCursorPagination';
import useTimeConfig from 'in-hooks/useTimeConfig';

const defaultSelectableFields = [{ type: 'metric', metricId: 'latency', aggregationId: 'MEAN' }];

const fields = [...defaultSelectableFields];

export default function useAlertingGroupsByEvaluationType(
  includeInternal,
  includeSynthetic,
  tagFilterExpression,
  evaluationType,
  isTagFilterFormModelValid
) {
  const timeConfig = { ...useTimeConfig(), to: Date.now(), focusedMoment: Date.now() };
  const metricDefinitionByEvaluationType = getMetricDefinitionByEvaluationType(evaluationType);
  const backendMetrics = useStableObjectInstance(
    fields
      .filter(({ type }) => type === metricType)
      .reduce((accumulator, metric) => {
        const backendMetric = {
          metric: metric.metricId,
          aggregation: metric.aggregationId
        };
        accumulator[getSingleNumberMetricId(metric)] = backendMetric;
        return accumulator;
      }, {})
  );

  const { totalHits } = useCursorPagination(
    ({ cursor }) =>
      isTagFilterFormModelValid &&
      getData({
        includeInternal,
        includeSynthetic,
        tagFilterExpression,
        timeConfig,
        metrics: backendMetrics,
        cursor,
        metricDefinitionByEvaluationType
      }),
    [backendMetrics, evaluationType]
  );

  return totalHits;
}

function getData({
  tagFilterExpression,
  includeInternal,
  includeSynthetic,
  timeConfig,
  metrics,
  cursor,
  metricDefinitionByEvaluationType
}) {
  return getCallGroups({
    tagFilterExpression: toBackendQueryModel(tagFilterExpression),
    group: {
      groupbyTag: metricDefinitionByEvaluationType.groupbyTag,
      groupbyTagEntity: metricDefinitionByEvaluationType.groupbyTagEntity
    },
    order: {
      by: metricDefinitionByEvaluationType.orderBy,
      direction: 'DESC'
    },
    pagination: {
      cursor,
      retrievalSize: 5
    },
    filter: {
      timeConfig
    },
    metrics: metrics,
    includeSynthetic,
    includeInternal,
    queryPrecision: 'APPROXIMATE'
  }).map(result => {
    if (result?.data?.items?.length) {
      return {
        ...result,
        data: {
          ...result.data
        }
      };
    }
    return result;
  });
}

function getMetricDefinitionByEvaluationType(evaluationType) {
  const metricDefinition = {
    customLatencyUiFormatterName: 'LATENCY_WITH_DECIMALS',
    itemlabelColumnId: 'name',
    groupbyTagEntity: 'DESTINATION',
    orderBy: 'latency_MEAN'
  };
  if (evaluationType === PER_AP) {
    return {
      ...metricDefinition,
      groupIcon: 'lib_application',
      groupbyTag: 'application.id'
    };
  } else if (evaluationType === PER_AP_SERVICE) {
    return {
      ...metricDefinition,
      groupIcon: 'lib_application_service',
      groupbyTag: 'service.id'
    };
  } else if (evaluationType === PER_AP_ENDPOINT) {
    return {
      ...metricDefinition,
      groupIcon: 'lib_application_endpoint',
      groupbyTag: 'endpoint.id'
    };
  }
}
