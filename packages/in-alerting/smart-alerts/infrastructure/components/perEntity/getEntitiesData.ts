/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { just } from '@instana/observables';

import {
  GetInfrastructureExploreQuery,
  InfraExploreCursor,
  Order,
  TagFilterExpressionElementUnion,
  TimeConfig
} from 'in-types';
import { MetricType } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { getGranularity, getSeriesKey } from 'in-infrastructure/Explore/services/metrics';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import { pendingResult } from 'in-services/fixedObjects';

type GetInfraEntitiesProps = {
  timeConfig: TimeConfig;
  backendQueryModel: TagFilterExpressionElementUnion;
  metricInfo: MetricType;
  retrievalSize: number;
  id: string;
  order: Order;
  type: string;
  cursor?: InfraExploreCursor;
  fullData?: boolean;
};

export function getEntitiesData({
  timeConfig,
  backendQueryModel,
  metricInfo,
  retrievalSize,
  id,
  order,
  type,
  cursor,
  fullData = false
}: GetInfraEntitiesProps) {
  if (!backendQueryModel) {
    return just(pendingResult);
  }

  const { metric, aggregation, crossSeriesAggregation, regex } = metricInfo;

  const kpiGranularity = timeConfig.windowSize;

  const query: GetInfrastructureExploreQuery = {
    filter: {
      tagFilterExpression: backendQueryModel,
      timeConfig
    },
    metrics: {
      [id]: {
        aggregation,
        crossSeriesAggregation,
        granularity: kpiGranularity,
        metric,
        regex,
        required: false
      },
      [getSeriesKey(id)]: {
        metric,
        granularity: getGranularity(timeConfig),
        aggregation,
        crossSeriesAggregation,
        regex,
        required: false
      }
    },
    order,
    pagination: {
      fullData,
      cursor,
      retrievalSize
    },
    tags: [],
    type
  };

  return getEntities(query);
}
