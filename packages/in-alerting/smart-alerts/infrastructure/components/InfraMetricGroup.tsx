/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';

import { Cursor, Order, Result, TagCatalog, TimeConfig } from '@instana/types';
import { just } from '@instana/observables';

import {
  OPERATOR_OR,
  addTagFilters,
  createTagFilterExpression
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { MetricType } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import InfraMetricGroupTableList from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricGroupTableList';
import { Tags } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { sparkChartGranularity } from 'in-alerting/smart-alerts/infrastructure/components/InfraChartUtils';
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
  timeConfig: TimeConfig;
  groupBy: string[];
  metricMetadatas: Result<Metadatas>;
  selectedMetricGroup?: Tags;
  setSelectedMetricGroup?: React.Dispatch<Tags>;
  tagCatalog?: TagCatalog;
}

/**
 * Renders the infrastructure metric group.
 * @param props The props.
 * @returns The component.
 */

export default function InfraMetricGroup(props: InfraMetricGroupProps) {
  const { backendQueryModel, backendGroupBy, order, type, metrics, timeConfig } = props;

  const [filterExpression, setFilterExpression] = useState<any>();
  const [orderByDirection, setOrderByDirection] = useState(order);

  // entire metrics [] do not need to be passed as dependency array to the 'useCursorPagination',
  // so extracting the fields and passing it to the dependency array.
  // The metric is not passed to the dependency array because when the metric value changes, the groupby is set to empty.
  // also, the entityType (type) is part of the dep array that is extracted from the selected metric.
  const crossSeriesAggregation = metrics?.[0]?.crossSeriesAggregation;
  const aggregation = metrics?.[0]?.aggregation;

  // backendGroupBy is an array, and shallowEquals checking for the array returns false,
  // resulting in re-rending of the table each time even if there is no change,
  // so passing it as a string value to the dependency array of useCursorPagination
  const groupByString = backendGroupBy?.toString();
  const chartConfig = JSON.stringify(timeConfig);

  useEffect(() => {
    setFilterExpression(backendQueryModel);
  }, [backendQueryModel]);

  const { totalHits, ...cursorPaginatedProps } = useCursorPagination(
    ({ cursor }) => {
      return getGroups({
        timeConfig,
        backendQueryModel: filterExpression,
        groupBy: backendGroupBy,
        order: orderByDirection,
        type,
        metrics,
        cursor,
        retrievalSize
      });
    },
    [chartConfig, filterExpression, orderByDirection, type, crossSeriesAggregation, groupByString, aggregation]
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
    />
  );
}

interface GroupProps
  extends Omit<
    InfraMetricGroupProps,
    'backendGroupBy' | 'metricMetadatas' | 'selectedMetricGroup' | 'setSelectedMetricGroup' | 'tagCatalog'
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
 * @returns The groups.
 */
export function getGroups({ timeConfig, backendQueryModel, groupBy, cursor, type, order, metrics }: GroupProps) {
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
                granularity: sparkChartGranularity,
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
