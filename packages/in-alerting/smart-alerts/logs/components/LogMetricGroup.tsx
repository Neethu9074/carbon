/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { TimeConfig } from '@instana/types';

import {
  EMPTY_EXPRESSION,
  OPERATOR_OR,
  addTagFilters,
  createTagFilterExpression
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import LogMetricGroupTableList from 'in-alerting/smart-alerts/logs/components/LogMetricGroupTableList';
import { IngestionOffsetCursor, TagFilterExpression, TagFilterExpressionElementUnion } from 'in-types';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { CONTAINS } from 'in-components/QueryBuilder/tagFilter/operators';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { CatalogResponse } from 'in-logging/api/catalog';

const retrievalSize = 5;

interface LogMetricGroupProps {
  backendQueryModel: TagFilterExpressionElementUnion;
  timeConfig: TimeConfig;
  groupBy: string[];
  selectedMetricGroup?: { [index: string]: any };
  setSelectedMetricGroup?: React.Dispatch<{ [index: string]: any }>;
  tagCatalog?: CatalogResponse;
}
/**
 * Renders the logs metric group table.
 */
export default function LogMetricGroup(props: LogMetricGroupProps) {
  const { backendQueryModel, timeConfig, groupBy } = props;

  const [filterExpression, setFilterExpression] = useState<any>();

  // shallowEquals checking for `groupBy`, `timeConfig`, and `filterExpression` is false
  // because it's in array and object format.
  // resulting in re-rending of the table each time even if there is no change,
  // so passing it as a string value to the dependency array of useCursorPagination
  const groupByString = groupBy?.toString();
  const chartConfig = JSON.stringify(timeConfig);
  const filterExpressionJSON = JSON.stringify(filterExpression);

  useEffect(() => {
    setFilterExpression(backendQueryModel);
  }, [backendQueryModel]);

  const { totalHits, ...cursorPaginatedProps } = useCursorPagination(
    ({ cursor }) => {
      return getGroups({
        timeConfig,
        backendQueryModel: filterExpression ?? EMPTY_EXPRESSION,
        groupBy: groupBy,
        //@ts-expect-error
        cursor,
        retrievalSize
      });
    },
    [chartConfig, filterExpressionJSON, groupByString]
  );

  return (
    <LogMetricGroupTableList
      retrievalSize={retrievalSize}
      fixedLayout
      totalHits={totalHits}
      setBackendQueryModel={searchBy => setBackendQueryModel(groupBy, backendQueryModel, setFilterExpression, searchBy)}
      {...props}
      {...cursorPaginatedProps}
    />
  );
}

/**
 * `getGroups` will get the list of Log-groups to be displayed in table
 */
function getGroups({
  timeConfig,
  backendQueryModel,
  groupBy,
  cursor,
  retrievalSize
}: {
  timeConfig: TimeConfig;
  backendQueryModel: TagFilterExpression;
  groupBy: string[];
  cursor: IngestionOffsetCursor;
  retrievalSize: number;
}) {
  return getLogGroups({
    timeConfig,
    group: { groupbyTag: groupBy[0], groupbyTagEntity: 'NOT_APPLICABLE' },
    tagFilterExpression: backendQueryModel,
    pagination: {
      retrievalSize,
      fullData: false,
      cursor
    }
  });
}

/**
 * Sets the backend query model filter expression.
 * @param searchBy The table search by value.
 */
function setBackendQueryModel(
  groupBy: string[],
  backendQueryModel: TagFilterExpressionElementUnion,
  setFilterExpression: any,
  searchBy?: string
) {
  if (searchBy) {
    const searchQuery = groupBy.map((groupBy: string) => {
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
