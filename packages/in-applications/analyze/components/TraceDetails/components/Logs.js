/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { ColumnizedContent, Ul, Li } from '@instana/components';

import {
  LOG_SPAN_ID,
  LOG_CUSTOM,
  getTraceIdTagFilter,
  LOG_LEVEL,
  LOG_EXCEPTION_TYPE,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE
} from 'in-logging/queryBuilder';
import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import { logLevelColumn, timestampColumn } from 'in-logging/analyze/AnalyzeView/utils/logsColumnUtils';
import LogMessageColumn from 'in-logging/analyze/AnalyzeView/components/LogMessageColumn';
import { LogTagsTable } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import getLogs from 'in-logging/subscriptions/getLogs';

import locals from './Logs.mless';

const columnDefinitions = [
  logLevelColumn,
  timestampColumn,
  {
    id: 'log',
    getContent: LogMessageColumn
  }
];

export default function Logs(props) {
  const { traceId, totalNumberOfLogs, selectedLogIdPair, selectLogId, timeConfigForLogs } = props;
  const { items, errors, progress } = useLogsCursorPagination(
    params => getData({ traceId, totalNumberOfLogs, timeConfigForLogs, ...params }),
    [traceId]
  );

  if (progress?.loading) {
    return <LoadingList numSkeletonRows={3} />;
  }

  const hasErrors = errors.length > 0;
  if (hasErrors) {
    return <ErrorList errors={errors} />;
  }

  return (
    <Ul space="disabled">
      {items.map(log => {
        const id = log.itemId;
        const spanId = getSpanIdFromTags(log.tags);
        const isSelected = selectedLogIdPair
          ? selectedLogIdPair.logId === id && spanId === selectedLogIdPair.spanId
          : false;
        return (
          <Li
            key={id}
            className={classNames({
              [locals.selectedRow]: isSelected
            })}
            onClick={() => selectLogId({ logId: id, spanId })}
            renderNestedContent={() => <LogTagsTable item={log} />}
          >
            <ColumnizedContent columnDefinitions={columnDefinitions} {...log} />
          </Li>
        );
      })}
    </Ul>
  );
}
function getData({ traceId, totalNumberOfLogs, timeConfigForLogs }) {
  return getLogs({
    timeConfig: timeConfigForLogs,
    retrievalSize: totalNumberOfLogs,
    tagFilterExpression: getTraceIdTagFilter(traceId),
    requestedTags: [
      LOG_SPAN_ID,
      LOG_LEVEL,
      LOG_CUSTOM,
      LOG_EXCEPTION_TYPE,
      LOG_EXCEPTION_MESSAGE,
      LOG_EXCEPTION_STACK_TRACE
    ]
  });
}

function getSpanIdFromTags(tags) {
  return tags.filter(({ name }) => name === LOG_SPAN_ID)[0]?.stringValue;
}
