/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext, useEffect } from 'react';

import { LogItem, TimeConfig, TraceActivityTreeNodeDetails } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  getCallIdTagFilter,
  LOG_CUSTOM,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE,
  LOG_EXCEPTION_TYPE,
  LOG_LEVEL,
  SPAN_STACK_TRACE
} from 'in-logging/queryBuilder';
import LogDetails, { LogSpanExcerpt } from 'in-components/Logging/TraceDetails/components/LogDetails/LogDetails';
import { getCardTitle } from 'in-components/Logging/TraceDetails/components/LogDetails/utils';
import { maxRetrievalSize } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';
import LogsInCallsContext from 'in-applications/analyze/AnalyzeView2_0/LogsInCallsContext';
import ExpandableGroup from 'in-components/ExpandableGroup';
import { loggingEnabled } from 'in-services/featureFlags';
import { pendingResult } from 'in-services/fixedObjects';
import ErrorBoundary from 'in-components/ErrorBoundary';
import getLogs from 'in-logging/subscriptions/getLogs';
import { t } from 'in-i18n';

const LogsCard = ({ call, processSnapshotId }: { call: TraceActivityTreeNodeDetails; processSnapshotId: string }) => {
  const { logs } = call;
  const { selectedLog, timeConfigForLogs, setSelectedLog } = useContext(LogsInCallsContext);
  const logsResult = useObservable(getData({ callId: call.id, timeConfig: timeConfigForLogs! }), []) ?? pendingResult;
  const hasLoggingLogs = logsResult.data?.items?.length > 0;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => setSelectedLog(null), []);

  if (logs.length === 0) return null;

  const cardTitle = `${t('in-analyze:traceDetail.tabs.summary.logs')} (${getCardTitle(
    hasLoggingLogs ? logsResult.data?.items : logs
  )})`;

  const handleToggle = (isToggled: boolean) => {
    if (!isToggled) setSelectedLog(null);
  };

  return (
    <ErrorBoundary name="log tree sidebar">
      <ExpandableGroup
        key={String(!!selectedLog)}
        onToggle={handleToggle}
        defaultExpanded={!!selectedLog}
        title={cardTitle}
      >
        {loggingEnabled && hasLoggingLogs
          ? logsResult.data.items.map((log: LogItem, i: number) => (
              <LogDetails
                callLog={logs[i] as LogSpanExcerpt}
                callId={call.id}
                loggingLog={log}
                processSnapshotId={processSnapshotId}
                key={i}
              />
            ))
          : logs.map((log, i) => (
              <LogDetails
                callId={call.id}
                callLog={log as LogSpanExcerpt}
                processSnapshotId={processSnapshotId}
                key={i}
              />
            ))}
      </ExpandableGroup>
    </ErrorBoundary>
  );
};

function getData({ callId, timeConfig }: { callId: string; timeConfig: TimeConfig }) {
  return getLogs({
    timeConfig,
    retrievalSize: maxRetrievalSize,
    tagFilterExpression: getCallIdTagFilter(callId),
    requestedTags: [
      LOG_LEVEL,
      LOG_CUSTOM,
      LOG_EXCEPTION_TYPE,
      LOG_EXCEPTION_MESSAGE,
      LOG_EXCEPTION_STACK_TRACE,
      SPAN_STACK_TRACE
    ]
  });
}

export default LogsCard;
