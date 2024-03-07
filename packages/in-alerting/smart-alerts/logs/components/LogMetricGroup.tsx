/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { Group, TimeConfig } from '@instana/types';

import LogMetricGroupTableList from 'in-alerting/smart-alerts/logs/components/LogMetricGroupTableList';
import { IngestionOffsetCursor, TagFilterExpression, TagFilterExpressionElementUnion } from 'in-types';
import { setBackendQueryModel } from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigUtils';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { CatalogResponse } from 'in-logging/api/catalog';

const retrievalSize = 5;

interface LogMetricGroupProps {
  backendQueryModel: TagFilterExpressionElementUnion;
  timeConfig: TimeConfig;
  groupBy: Group[];
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
  const groupByString = JSON.stringify(groupBy);
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
      groupBy={groupBy}
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
  groupBy: Group[];
  cursor: IngestionOffsetCursor;
  retrievalSize: number;
}) {
  return getLogGroups({
    timeConfig,
    group: groupBy[0],
    tagFilterExpression: backendQueryModel,
    pagination: {
      retrievalSize,
      fullData: false,
      cursor
    }
  });
}
