/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { just } from '@instana/observables';

import {
  AggregationType,
  GetInfrastructureExploreQuery,
  Order,
  TagFilterExpressionElementUnion,
  TimeConfig
} from 'in-types';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { getSeriesKey } from 'in-infrastructure/Explore/services/metrics';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import { pendingResult } from 'in-services/fixedObjects';

type GetTableDataParams = {
  timeConfig: TimeConfig;
  granularity: number;
  backendQueryModel: FormModelElement[];
  metric: string;
  retrievalSize: number;
  id: string;
  aggregation: AggregationType;
  crossSeriesAggregation: AggregationType;
  order: Order;
  type: string;
  tagFilterExpression: TagFilterExpressionElementUnion;
  regex: boolean;
  fullData?: boolean;
};

export function getEntitiesData({
  timeConfig,
  granularity,
  backendQueryModel,
  metric,
  retrievalSize,
  id,
  aggregation,
  crossSeriesAggregation,
  order,
  type,
  tagFilterExpression,
  regex,
  fullData = false
}: GetTableDataParams) {
  if (!backendQueryModel) {
    return just(pendingResult);
  }

  const kpiGranularity = timeConfig.windowSize;

  const query: GetInfrastructureExploreQuery = {
    filter: {
      tagFilterExpression: tagFilterExpression,
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
        granularity: granularity,
        aggregation,
        regex,
        crossSeriesAggregation,
        required: false
      }
    },
    order,
    pagination: {
      fullData: fullData,
      retrievalSize: retrievalSize
    },
    tags: [],
    type
  };

  return getEntities(query);
}
