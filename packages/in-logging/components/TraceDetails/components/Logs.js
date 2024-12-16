/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { ColumnizedContent, Li, Ul } from '@instana/components';

import { logLevelColumn, timestampColumn } from 'in-logging/analyze/AnalyzeView/utils/logsColumnUtils';
import { useLogsInCallsContext } from 'in-logging/components/TraceDetails/LogsInCallsContext';
import LogMessageColumn from 'in-logging/analyze/AnalyzeView/components/LogMessageColumn';
import { LogTagsTable } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { getCallIdFromTags } from 'in-logging/components/TraceDetails/utils';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { LOG_SPAN_ID } from 'in-logging/queryBuilder';

import analyzeLocals from 'in-logging/analyze/AnalyzeView/components/Logs.mless';
import locals from 'in-logging/components/TraceDetails/components/Logs.mless';

const columnDefinitions = [
  logLevelColumn,
  timestampColumn,
  {
    id: 'log',
    getContent: LogMessageColumn
  }
];

export default function Logs(props) {
  const { setSelectedLog, progress, items, errors } = useLogsInCallsContext();

  const { selectedLogIdPair, setCallId } = props;
  const [isToggled, setIsToggled] = useState({});

  if (progress?.loading) {
    return <LoadingList numSkeletonRows={3} />;
  }

  const hasErrors = errors.length > 0;
  if (hasErrors) {
    return <ErrorList errors={errors} />;
  }

  const handleLogItemToggle = itemId => {
    setIsToggled(prevStates => ({
      ...prevStates,
      [itemId]: !prevStates[itemId]
    }));
  };

  return (
    <Ul className={analyzeLocals.removeBackground} space="disabled">
      {items.map(log => {
        const id = log.itemId;
        const spanId = getSpanIdFromTags(log.tags);
        const callId = getCallIdFromTags(log.tags);

        const isSelected = selectedLogIdPair
          ? selectedLogIdPair.logId === id && spanId === selectedLogIdPair.spanId
          : false;

        return (
          <Li
            onMouseUp={() => {
              handleLogItemToggle(id);
              setCallId(callId);
              setSelectedLog(log);
            }}
            key={id}
            className={classNames({
              [locals.selectedRow]: isSelected,
              [locals.alignContent]: true
            })}
            renderNestedContent={() => <LogTagsTable item={log} />}
            toggleContentOnRowClick
          >
            <ColumnizedContent columnDefinitions={columnDefinitions} {...log} isToggled={!!isToggled[id]} />
          </Li>
        );
      })}
    </Ul>
  );
}
function getSpanIdFromTags(tags) {
  return tags.filter(({ name }) => name === LOG_SPAN_ID)[0]?.stringValue;
}
