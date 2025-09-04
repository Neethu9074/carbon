/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';
// @ts-expect-error import Summary from 'in-applications/analyze/AnalyzeView2_0/Summary';
import Summary from 'in-applications/analyze/AnalyzeView2_0/Summary';
import { LARGE_TRACE_THRESHOLD } from 'in-applications/analyze/AnalyzeView2_0/traceSummary';

export default {
  component: Summary
};
const trace = {
  'duration': 9,
  'callCount': 6,
  'totalErrorCount': 7
};
const largeTrace = { ...trace, 'callCount': LARGE_TRACE_THRESHOLD + 1 };
const largeTraceLazy = { ...largeTrace, allowLazyLoading: true };

export const DefaultSummary = () => {
  return <Summary data={trace} traceId={'aaaaaa'} />;
};
export const SubtraceSummaryTimelineHidden = () => {
  return <Summary dataSource="subtraces" data={trace} traceId={'d3b5f215fa96cbbd'} />;
};
export const TraceSummaryLargeTrace = () => {
  return <Summary dataSource="subtraces" data={largeTrace} traceId={'d3b5f215fa96cbbd'} />;
};
export const TraceSummaryLargeTraceLazyLoading = () => {
  return <Summary dataSource="subtraces" data={largeTraceLazy} traceId={'d3b5f215fa96cbbd'} />;
};
