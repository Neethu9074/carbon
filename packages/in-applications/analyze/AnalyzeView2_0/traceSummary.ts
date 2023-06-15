/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { largeTracesV2Enabled } from 'in-services/featureFlags';
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
  return Boolean(largeTracesV2Enabled && traceSummaryData?.allowLazyLoading);
}

export function shouldUseLazyLoadedCallTree(traceSummaryData?: TraceSummary): boolean {
  return Boolean(isLazyLoadedCallTreeSupported(traceSummaryData) && isLargeTrace(traceSummaryData));
}
