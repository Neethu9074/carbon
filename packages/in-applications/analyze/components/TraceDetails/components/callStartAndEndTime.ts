/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TraceActivityTreeNode } from '@instana/types';

import { CallNode, isLazyNode } from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';

export function getStart(call: CallNode | TraceActivityTreeNode) {
  let earliestStart = isLazyNode(call) ? Number.MAX_VALUE : call.start;
  if (call.children) {
    for (let i = 0; i < call.children.length; i++) {
      earliestStart = Math.min(earliestStart || Number.MAX_VALUE, getStart(call.children[i]));
    }
  }
  return earliestStart;
}

export function getEnd(call: CallNode | TraceActivityTreeNode) {
  let latestEnd = isLazyNode(call) ? Number.MIN_VALUE : call.start + call.duration;
  if (call.children) {
    for (let i = 0; i < call.children.length; i++) {
      latestEnd = Math.max(latestEnd || Number.MIN_VALUE, getEnd(call.children[i]));
    }
  }
  return latestEnd;
}
