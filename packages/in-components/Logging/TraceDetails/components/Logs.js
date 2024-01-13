/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext } from 'react';
import classNames from 'classnames';

import { ColumnizedContent, Li, Ul } from '@instana/components';

import {
  getTraceIdTagFilter,
  LOG_CALL_ID,
  LOG_CUSTOM,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE,
  LOG_EXCEPTION_TYPE,
  LOG_LEVEL,
  LOG_SPAN_ID
} from 'in-logging/queryBuilder';
import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import { logLevelColumn, timestampColumn } from 'in-logging/analyze/AnalyzeView/utils/logsColumnUtils';
import { maxRetrievalSize } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';
import LogsInCallsContext from 'in-applications/analyze/AnalyzeView2_0/LogsInCallsContext';
import LogMessageColumn from 'in-logging/analyze/AnalyzeView/components/LogMessageColumn';
import { LogTagsTable } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { getCallIdFromTags } from 'in-components/Logging/TraceDetails/utils';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import getLogs from 'in-logging/subscriptions/getLogs';

import locals from 'in-components/Logging/TraceDetails/components/Logs.mless';

const columnDefinitions = [
  logLevelColumn,
  timestampColumn,
  {
    id: 'log',
    getContent: LogMessageColumn
  }
];

export default function Logs(props) {
  const { setSelectedLog } = useContext(LogsInCallsContext);

  const { traceId, totalNumberOfLogs, selectedLogIdPair, timeConfigForLogs, setCallId } = props;
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
        const callId = getCallIdFromTags(log.tags);

        const isSelected = selectedLogIdPair
          ? selectedLogIdPair.logId === id && spanId === selectedLogIdPair.spanId
          : false;

        return (
          <Li
            onClick={() => {
              setCallId(callId);
              setSelectedLog(log);
            }}
            key={id}
            className={classNames({
              [locals.selectedRow]: isSelected
            })}
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
  const cappedRetrievalSize = totalNumberOfLogs < maxRetrievalSize ? totalNumberOfLogs : maxRetrievalSize;

  return getLogs({
    timeConfig: timeConfigForLogs,
    retrievalSize: cappedRetrievalSize,
    tagFilterExpression: getTraceIdTagFilter(traceId),
    requestedTags: [
      LOG_SPAN_ID,
      LOG_LEVEL,
      LOG_CUSTOM,
      LOG_EXCEPTION_TYPE,
      LOG_EXCEPTION_MESSAGE,
      LOG_EXCEPTION_STACK_TRACE,
      LOG_CALL_ID
    ]
  });
}

function getSpanIdFromTags(tags) {
  return tags.filter(({ name }) => name === LOG_SPAN_ID)[0]?.stringValue;
}
