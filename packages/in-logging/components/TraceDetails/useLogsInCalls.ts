/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useMemo, useState } from 'react';

import { TimeConfig, TraceSummary } from '@instana/types';

import {
  getTraceIdTagFilter,
  LOG_CALL_ID,
  LOG_CUSTOM,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE,
  LOG_EXCEPTION_TYPE,
  LOG_LEVEL,
  LOG_SPAN_ID,
  LOG_STREAM_NAME
} from 'in-logging/queryBuilder';
import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import { and, or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { CtaTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { maxRetrievalSize } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { handleLogCallsWithFilters } from 'in-logging/analyze/AnalyzeView/utils';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { loggingEnabled } from 'in-services/featureFlags';
import getLogs from 'in-logging/subscriptions/getLogs';
import { hours } from 'in-services/time';

interface GetDataParams {
  traceId: string;
  timeConfig: TimeConfig;
  numLogsToFetch?: number;
}

interface UseLogsInCallsParams {
  traceId: string;
  trace: any;
  numLogsToFetch?: number;
}
//This const timeWindowExtend is a buffer to the trace start time and duration, we had to extend it (minutes -> hours) to get the data consistent.
const timeWindowExtend = hours.toMillis(10);

const useTimeConfigForLogs = (trace: TraceSummary) => {
  return useMemo(
    () => ({
      to: trace.startTime + timeWindowExtend,
      windowSize: trace.duration + timeWindowExtend * 2,
      focusedMoment: trace.startTime + timeWindowExtend,
      autoRefresh: false
    }),
    [trace.duration, trace.startTime]
  );
};

const useLogsInCalls = loggingEnabled ? useLogsInCallsWithLogging : useLogsInCallsWithoutLogging;

function useLogsInCallsWithLogging({ traceId, trace, numLogsToFetch }: UseLogsInCallsParams) {
  const timeConfigForLogs = useTimeConfigForLogs(trace);
  const [selectedLog, setSelectedLog] = useState(null);
  const { trackCta } = useSegmentTracking();
  const { items, errors, progress } = useLogsCursorPagination(
    params => getData(trackCta, { traceId, timeConfig: timeConfigForLogs, numLogsToFetch, ...params }),
    [traceId]
  );

  const logsContextValue = useMemo(
    () => ({ selectedLog, setSelectedLog, timeConfigForLogs, items, errors, progress }),
    [errors, items, progress, selectedLog, timeConfigForLogs]
  );

  return { logsContextValue };
}

function useLogsInCallsWithoutLogging({ trace }: UseLogsInCallsParams) {
  const timeConfigForLogs = useTimeConfigForLogs(trace);

  const [selectedLog, setSelectedLog] = useState(null);

  const logsContextValue = useMemo(
    () => ({ selectedLog, setSelectedLog, timeConfigForLogs, items: [] }),
    [selectedLog, timeConfigForLogs]
  );

  return { logsContextValue };
}

function getData(trackCta: CtaTrackingFunction, { traceId, timeConfig, numLogsToFetch }: GetDataParams) {
  const callBody = {
    timeConfig,
    retrievalSize: numLogsToFetch ?? maxRetrievalSize,
    tagFilterExpression: toBackendQueryModel(
      joinExpressions({
        logicalOperator: and,
        expressions: [
          getTraceIdTagFilter(traceId),
          joinExpressions({
            logicalOperator: or,
            expressions: [tagFilter(LOG_LEVEL, EQUALS, 'WARN'), tagFilter(LOG_LEVEL, EQUALS, 'ERROR')]
          })
        ]
      })
    ),
    requestedTags: [
      LOG_SPAN_ID,
      LOG_LEVEL,
      LOG_CUSTOM,
      LOG_EXCEPTION_TYPE,
      LOG_EXCEPTION_MESSAGE,
      LOG_EXCEPTION_STACK_TRACE,
      LOG_CALL_ID,
      LOG_STREAM_NAME
    ]
  };
  const mixpanelProps = {
    timeConfig: callBody.timeConfig,
    tagFilterExpression: callBody.tagFilterExpression
  };
  handleLogCallsWithFilters(trackCta, mixpanelProps);

  return getLogs(callBody);
}

export default useLogsInCalls;
