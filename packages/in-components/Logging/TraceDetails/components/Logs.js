/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { ColumnizedContent, Li, Ul } from '@instana/components';

import { logLevelColumn, timestampColumn } from 'in-logging/analyze/AnalyzeView/utils/logsColumnUtils';
import { useLogsInCallsContext } from 'in-components/Logging/TraceDetails/LogsInCallsContext';
import LogMessageColumn from 'in-logging/analyze/AnalyzeView/components/LogMessageColumn';
import { LogTagsTable } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { getCallIdFromTags } from 'in-components/Logging/TraceDetails/utils';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { LOG_SPAN_ID } from 'in-logging/queryBuilder';

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
  const { setSelectedLog, items, progress, errors } = useLogsInCallsContext();

  const { selectedLogIdPair, setCallId } = props;

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
function getSpanIdFromTags(tags) {
  return tags.filter(({ name }) => name === LOG_SPAN_ID)[0]?.stringValue;
}
