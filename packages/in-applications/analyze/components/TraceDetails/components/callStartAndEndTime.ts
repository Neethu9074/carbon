/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TraceActivityTreeNode } from '@instana/types/index';

import { GeneratedNode } from 'in-applications/analyze/AnalyzeView2_0/buildTraceActivityTree';

export function getStart(call: TraceActivityTreeNode | GeneratedNode) {
  let earliestStart = call.start;
  if (call.children) {
    for (let i = 0; i < call.children.length; i++) {
      earliestStart = Math.min(earliestStart || Number.MAX_VALUE, getStart(call.children[i]));
    }
  }
  return earliestStart;
}

export function getEnd(call: TraceActivityTreeNode | GeneratedNode) {
  let latestEnd = call.start + call.duration;
  if (call.children) {
    for (let i = 0; i < call.children.length; i++) {
      latestEnd = Math.max(latestEnd || Number.MIN_VALUE, getEnd(call.children[i]));
    }
  }
  return latestEnd;
}
