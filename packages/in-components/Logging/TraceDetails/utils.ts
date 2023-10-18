/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { LogTag, TimeConfig } from '@instana/types';

import {
  getTraceIdTagFilter,
  LOG_CALL_ID,
  LOG_CUSTOM,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE,
  LOG_EXCEPTION_TYPE,
  LOG_ITEM_ID,
  LOG_LEVEL,
  LOG_MESSAGE,
  LOG_SPAN_ID
} from 'in-logging/queryBuilder';
import { maxRetrievalSize } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';
import getLogs from 'in-logging/subscriptions/getLogs';

export function getLogDataForCalls({ traceId, timeConfigForLogs }: { traceId: string; timeConfigForLogs: TimeConfig }) {
  return getLogs({
    timeConfig: timeConfigForLogs,
    retrievalSize: maxRetrievalSize,
    tagFilterExpression: getTraceIdTagFilter(traceId),
    requestedTags: [
      LOG_ITEM_ID,
      LOG_SPAN_ID,
      LOG_LEVEL,
      LOG_CUSTOM,
      LOG_EXCEPTION_TYPE,
      LOG_EXCEPTION_MESSAGE,
      LOG_EXCEPTION_STACK_TRACE,
      LOG_CALL_ID,
      LOG_MESSAGE
    ]
  });
}

export function getSpanIdFromTags(tags: LogTag[]) {
  return tags.filter(({ name }) => name === LOG_SPAN_ID)[0]?.stringValue;
}

export function getCallIdFromTags(tags: LogTag[]) {
  return tags.filter(({ name }) => name === LOG_CALL_ID)[0]?.stringValue;
}
