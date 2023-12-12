/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Cursor, Order, Result, TimeConfig } from '@instana/types';
import { just } from '@instana/observables';

import {
  OPERATOR_OR,
  addTagFilters,
  createTagFilterExpression
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { MetricType } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import InfraMetricGroupTableList from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricGroupTableList';
//@ts-expect-error
import createGetGroupsSubscription from 'in-infrastructure/subscriptions/getGroups';
import { getMetricKey, getSeriesKey } from 'in-infrastructure/Explore/services/metrics';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { CONTAINS } from 'in-components/QueryBuilder/tagFilter/operators';
import { Metadatas } from 'in-infrastructure/hooks/useMetricMetadatas';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { TagFilterExpressionElementUnion } from 'in-types';
import { pendingResult } from 'in-services/fixedObjects';

const retrievalSize = 5;

interface InfraMetricGroupProps {
  backendQueryModel: TagFilterExpressionElementUnion;
  backendGroupBy: string[];
  order: Order;
  type: string;
  metrics: MetricType[];
  granularity: number;
  timeConfig: TimeConfig;
  groupBy: string[];
  metricMetadatas: Result<Metadatas>;
}

/**
 * Renders the infrastructure metric group.
 * @param props The props.
 * @returns The component.
 */

export default function InfraMetricGroup(props: InfraMetricGroupProps) {
  const { backendQueryModel, backendGroupBy, order, type, metrics, granularity, timeConfig } = props;

  const [filterExpression, setFilterExpression] = useState(backendQueryModel);
  const [orderByDirection, setOrderByDirection] = useState(order);

  const { totalHits, ...cursorPaginatedProps } = useCursorPagination(
    ({ cursor }) =>
      getGroups({
        timeConfig,
        backendQueryModel: filterExpression,
        groupBy: backendGroupBy,
        order: orderByDirection,
        type,
        metrics,
        granularity,
        cursor,
        retrievalSize
      }),
    [timeConfig, filterExpression, backendGroupBy, orderByDirection, type, metrics]
  );

  /**
   * Handles the order by change.
   * @param orderBy The order by value with field and direction .
   */
  function onOrderByChange(orderBy: Order) {
    setOrderByDirection(orderBy);
  }

  /**
   * Sets the backend query model.
   * @param searchBy The table search by value.
   */
  function setBackendQueryModel(searchBy?: string) {
    if (searchBy) {
      const searchQuery = backendGroupBy.map((groupBy: string) => {
        return tagFilter(groupBy, CONTAINS, searchBy, null, NOT_APPLICABLE);
      });

      if (backendQueryModel?.type === 'TAG_FILTER' || backendQueryModel?.elements?.length > 0) {
        const searchQueryModel = addTagFilters(createTagFilterExpression(OPERATOR_OR, searchQuery), [
          backendQueryModel
        ]);

        setFilterExpression(searchQueryModel);
        return;
      } else {
        setFilterExpression(createTagFilterExpression(OPERATOR_OR, searchQuery));
        return;
      }
    }

    setFilterExpression(backendQueryModel);
  }

  return (
    <InfraMetricGroupTableList
      retrievalSize={retrievalSize}
      fixedLayout
      isTableMode
      totalHits={totalHits}
      {...props}
      {...cursorPaginatedProps}
      order={orderByDirection}
      setBackendQueryModel={setBackendQueryModel}
      onOrderByChange={onOrderByChange}
    />
  );
}

interface GroupProps extends Omit<InfraMetricGroupProps, 'backendGroupBy' | 'metricMetadatas'> {
  cursor?: Cursor;
  retrievalSize: number;
}

/**
 * Gets the groups.
 * @param timeConfig The time config.
 * @param backendQueryModel The backendQueryModel.
 * @param groupBy The group by.
 * @param cursor The cursor.
 * @param type The type.
 * @param order The order.
 * @param metrics The metrics.
 * @param retrievalSize The retrieval size.
 * @param granularity The granularity.
 * @returns The groups.
 */
export function getGroups({
  timeConfig,
  backendQueryModel,
  groupBy,
  cursor,
  type,
  order,
  metrics,
  retrievalSize,
  granularity
}: GroupProps) {
  if (!backendQueryModel) {
    return just(pendingResult);
  }

  return createGetGroupsSubscription({
    filter: {
      timeConfig,
      tagFilterExpression: backendQueryModel
    },
    pagination: {
      cursor,
      retrievalSize,
      fullData: false
    },
    groupBy,
    type,
    metrics: Object.fromEntries(
      metrics
        .filter(metricType => new Boolean(metricType.metric))
        .flatMap(({ metric, aggregation, crossSeriesAggregation, regex }: MetricType) => {
          const id = getMetricKey(metric, aggregation, crossSeriesAggregation);
          const kpiGranularity = timeConfig.windowSize;
          return [
            [
              id,
              {
                metric,
                granularity: kpiGranularity,
                aggregation,
                crossSeriesAggregation,
                regex
              }
            ],
            [
              getSeriesKey(id),
              {
                metric,
                granularity,
                aggregation,
                crossSeriesAggregation,
                regex
              }
            ]
          ];
        })
    ),
    order
  });
}
