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
import { getApplicationsWithDefaults } from 'in-alerting/smart-alerts/applications/tearSheet/subscriptions/getApplications';
import { getSingleNumberMetricId, getSparkChartTimeSeriesMetricId } from 'in-components/AnalyzeView/metrics';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import getCallGroups from 'in-applications/subscriptions/getCallGroups';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import useCursorPagination from 'in-hooks/useCursorPagination';

export const defaultSelectableFields = [{ type: 'metric', metricId: 'latency', aggregationId: 'MEAN' }];
export const fields = [...defaultSelectableFields];
export const WINDOW_SIZE = 86400000;
export const timeConfig = {
  to: Date.now(),
  focusedMoment: Date.now(),
  autoRefresh: false, // analyse calls are not supported in Live mode, so setting autoRefresh as false
  windowSize: WINDOW_SIZE
};

export default function useAlertingGroupsByEvaluationType(
  includeInternal,
  includeSynthetic,
  tagFilterExpression,
  evaluationType,
  isTagFilterFormModelValid,
  applications,
  granularity
) {
  const isApplicationExists = Boolean(Object.keys(applications).length > 0);
  const metricDefinitionByEvaluationType = getMetricDefinitionByEvaluationType(evaluationType);
  const backendMetrics = useStableObjectInstance(
    isApplicationExists &&
      fields
        .filter(({ type }) => type === metricType)
        .reduce((accumulator, metric) => {
          const backendMetric = {
            metric: metric.metricId,
            aggregation: metric.aggregationId
          };
          accumulator[getSingleNumberMetricId(metric)] = backendMetric;
          accumulator[getSparkChartTimeSeriesMetricId(metric)] = {
            ...backendMetric,
            granularity
          };
          return accumulator;
        }, {})
  );
  const { totalHits, awaitingData, errors } = useCursorPagination(
    ({ cursor }) => {
      return (
        isTagFilterFormModelValid &&
        isApplicationExists &&
        getData({
          includeInternal,
          includeSynthetic,
          tagFilterExpression,
          timeConfig,
          metrics: backendMetrics,
          cursor,
          metricDefinitionByEvaluationType,
          evaluationType,
          granularity
        })
      );
    },
    [backendMetrics, evaluationType, tagFilterExpression, timeConfig, includeInternal, includeSynthetic, granularity]
  );

  if (!isApplicationExists) {
    return 0;
  } else if (errors?.length > 0) {
    return errors;
  } else if (awaitingData) {
    return 'loading';
  }
  return totalHits ?? 0;
}

export function getData({
  tagFilterExpression,
  includeInternal,
  includeSynthetic,
  timeConfig,
  metrics,
  cursor,
  metricDefinitionByEvaluationType,
  evaluationType,
  pagination,
  granularity
}) {
  if (evaluationType === PER_AP) {
    const order = {
      by: 'applicationLabel',
      direction: 'ASC'
    };

    return getApplicationsWithDefaults({
      timeConfig,
      page: pagination?.page ?? 1,
      pageSize: pagination?.pageSize ?? 5,
      orderBy: order.by,
      orderDirection: order.direction,
      contextScope: 'NONE',
      tagFilterExpression,
      granularity
    });
  }

  return getCallGroups({
    tagFilterExpression,
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
