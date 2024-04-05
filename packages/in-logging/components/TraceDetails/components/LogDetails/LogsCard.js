/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  getCallIdTagFilter,
  getSpanIdTagFilter,
  LOG_CUSTOM,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE,
  LOG_EXCEPTION_TYPE,
  LOG_LEVEL,
  SPAN_STACK_TRACE
} from 'in-logging/queryBuilder';
import { and, or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getCardTitle } from 'in-logging/components/TraceDetails/components/LogDetails/utils';
import { maxRetrievalSize } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';
import { useLogsInCallsContext } from 'in-logging/components/TraceDetails/LogsInCallsContext';
import LogDetails from 'in-logging/components/TraceDetails/components/LogDetails/LogDetails';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { handleLogCallsWithFilters } from 'in-logging/analyze/AnalyzeView/utils/index';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { finishedProgress, pendingResult } from 'in-services/fixedObjects';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import ExpandableGroup from 'in-components/ExpandableGroup';
import { loggingEnabled } from 'in-services/featureFlags';
import ErrorBoundary from 'in-components/ErrorBoundary';
import getLogs from 'in-logging/subscriptions/getLogs';
import { t } from 'in-i18n';

const LogsCard = ({ call, processSnapshotId }) => {
  const { logs } = call;
  const { selectedLog, timeConfigForLogs, setSelectedLog } = useLogsInCallsContext();
  const logsResult = useObservable(getData({ callId: call.id, timeConfig: timeConfigForLogs }), []) ?? pendingResult;
  const hasLoggingLogs = logsResult?.data?.items?.length > 0;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => setSelectedLog(null), []);

  if (logs.length === 0 && !hasLoggingLogs) return null;

  const cardTitle = `${t('in-analyze:traceDetail.tabs.summary.logs')} (${getCardTitle(
    hasLoggingLogs ? logsResult.data?.items : logs
  )})`;

  const handleToggle = isToggled => {
    if (!isToggled) setSelectedLog(null);
  };

  return (
    <ErrorBoundary name="log tree sidebar">
      <ExpandableGroup key={!!selectedLog} onToggle={handleToggle} defaultExpanded={!!selectedLog} title={cardTitle}>
        {loggingEnabled && hasLoggingLogs
          ? logsResult.data.items.map((log, i) => (
              <LogDetails
                callLog={logs[i]}
                callId={call.id}
                loggingLog={log}
                processSnapshotId={processSnapshotId}
                key={i}
              />
            ))
          : logs.map((log, i) => (
              <LogDetails callId={call.id} callLog={log} processSnapshotId={processSnapshotId} key={i} />
            ))}
      </ExpandableGroup>
    </ErrorBoundary>
  );
};

function getData({ callId, timeConfig }) {
  if (!loggingEnabled) {
    return just({
      errors: [],
      progress: finishedProgress,
      data: []
    });
  }
  const callBody = {
    timeConfig,
    retrievalSize: maxRetrievalSize,
    tagFilterExpression: toBackendQueryModel(
      joinExpressions({
        logicalOperator: and,
        expressions: [
          joinExpressions({
            logicalOperator: or,
            expressions: [getCallIdTagFilter(callId), getSpanIdTagFilter(callId)]
          }),
          joinExpressions({
            logicalOperator: or,
            expressions: [tagFilter(LOG_LEVEL, EQUALS, 'WARN'), tagFilter(LOG_LEVEL, EQUALS, 'ERROR')]
          })
        ]
      })
    ),
    requestedTags: [
      LOG_LEVEL,
      LOG_CUSTOM,
      LOG_EXCEPTION_TYPE,
      LOG_EXCEPTION_MESSAGE,
      LOG_EXCEPTION_STACK_TRACE,
      SPAN_STACK_TRACE
    ]
  };

  const mixpanelProps = {
    timeConfig: callBody.timeConfig,
    tagFilterExpression: callBody.tagFilterExpression
  };

  handleLogCallsWithFilters(mixpanelProps);

  return getLogs(callBody);
}

export default LogsCard;
