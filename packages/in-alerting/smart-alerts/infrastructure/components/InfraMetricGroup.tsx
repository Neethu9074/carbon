/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';

import { Cursor, Order, Result, TimeConfig } from '@instana/types';
import { just } from '@instana/observables';

import {
  OPERATOR_OR,
  addTagFilters,
  createTagFilterExpression
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { MetricType } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import InfraMetricGroupTableList from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricGroupTableList';
import { Tags } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
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

const listSize = 5;

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
  selectedMetricGroup?: Tags;
  setSelectedMetricGroup?: React.Dispatch<Tags>;
}

/**
 * Renders the infrastructure metric group.
 * @param props The props.
 * @returns The component.
 */

export default function InfraMetricGroup(props: InfraMetricGroupProps) {
  const { backendQueryModel, backendGroupBy, order, type, metrics, granularity, timeConfig } = props;

  const [filterExpression, setFilterExpression] = useState<any>();
  const [orderByDirection, setOrderByDirection] = useState(order);
  const [retrievalSize, setRetrievalSize] = useState(5);

  useEffect(() => {
    setFilterExpression(backendQueryModel);
  }, [backendQueryModel]);

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

  return (
    <InfraMetricGroupTableList
      retrievalSize={retrievalSize}
      fixedLayout
      isTableMode
      totalHits={totalHits}
      {...props}
      {...cursorPaginatedProps}
      order={orderByDirection}
      setBackendQueryModel={searchBy =>
        setBackendQueryModel(backendGroupBy, backendQueryModel, setFilterExpression, searchBy)
      }
      onOrderByChange={onOrderByChange}
      setRetrievalSize={setRetrievalSize}
    />
  );
}

interface GroupProps
  extends Omit<
    InfraMetricGroupProps,
    'backendGroupBy' | 'metricMetadatas' | 'selectedMetricGroup' | 'setSelectedMetricGroup'
  > {
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
      cursor: cursor && { ...cursor, offset: retrievalSize === listSize ? 0 : retrievalSize - listSize },
      retrievalSize: !cursor ? retrievalSize : listSize,
      fullData: false
    },
    groupBy,
    type,
    metrics: Object.fromEntries(
      metrics
        .filter(metricType => new Boolean(metricType.metric))
        .flatMap(({ metric, aggregation, crossSeriesAggregation, regex }: MetricType) => {
          const id = getMetricKey(metric, aggregation, crossSeriesAggregation);
          const kpiGranularity = timeConfig && timeConfig.windowSize;
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

/**
 * Sets the backend query model.
 * @param searchBy The table search by value.
 */
function setBackendQueryModel(
  backendGroupBy: string[],
  backendQueryModel: TagFilterExpressionElementUnion,
  setFilterExpression: any,
  searchBy?: string
) {
  if (searchBy) {
    const searchQuery = backendGroupBy.map((groupBy: string) => {
      groupBy = groupBy === 'dfq.type' ? 'dfq.selftype' : groupBy;
      return tagFilter(groupBy, CONTAINS, searchBy, null, NOT_APPLICABLE);
    });

    if (backendQueryModel?.type === 'TAG_FILTER' || backendQueryModel?.elements?.length > 0) {
      const searchQueryModel = addTagFilters(createTagFilterExpression(OPERATOR_OR, searchQuery), [backendQueryModel]);

      setFilterExpression(searchQueryModel);
      return;
    } else {
      setFilterExpression(createTagFilterExpression(OPERATOR_OR, searchQuery));
      return;
    }
  }

  setFilterExpression(backendQueryModel);
}
