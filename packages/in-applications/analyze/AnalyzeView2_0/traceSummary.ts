/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TraceSummary } from 'in-types';

export const LARGE_TRACE_THRESHOLD = 1000;

export function isLargeTrace(traceSummaryData?: TraceSummary): boolean {
  return (
    traceSummaryData != null &&
    // The number of visual items we would have to render dictates whether a trace is large or not.
    // The callCount itself is misleading, because a call can be batched. So a single visual item
    // would represent 500 calls. This is why we are preferring callCountIgnoringBatchSize
    // over callCount
    (traceSummaryData.callCountIgnoringBatchSize || traceSummaryData.callCount) > LARGE_TRACE_THRESHOLD
  );
}

export function isLazyLoadedCallTreeSupported(traceSummaryData?: TraceSummary): boolean {
  return Boolean(traceSummaryData?.allowLazyLoading);
}

export function shouldUseLazyLoadedCallTree(traceSummaryData?: TraceSummary): boolean {
  return Boolean(isLazyLoadedCallTreeSupported(traceSummaryData) && isLargeTrace(traceSummaryData));
}

export const traceDownloadUrl = (traceId: string, traceSummary?: TraceSummary) =>
  isLazyLoadedCallTreeSupported(traceSummary)
    ? `/api/application-monitoring/v2/analyze/traces/${encodeURIComponent(
        traceId
      )}?pretty&retrievalSize=200&offset=0&ingestionTime=${Date.now()}`
    : `/api/application-monitoring/analyze/traces;id=${encodeURIComponent(traceId)}?pretty`;

export const rawTraceDownloadUrl = (traceId: string) =>
  `/api/application-monitoring/analyze/traces/${encodeURIComponent(
    traceId
  )}/raw?retrievalSize=100&offset=0&ingestionTime=${Date.now()}`;
