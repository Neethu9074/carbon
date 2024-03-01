/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { LogItem, TraceActivityTreeNode } from '@instana/types';

import { CallNode, isLazyNode } from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';

export function getStart(call: CallNode | TraceActivityTreeNode, logs?: LogItem[]) {
  let earliestStart = isLazyNode(call) ? Number.MAX_VALUE : call.start;
  if ('logEvents' in call) {
    const logEventTimestamps = call.logEvents!.map(event => event.timestamp);
    earliestStart = Math.min(earliestStart, ...logEventTimestamps);
  }
  if (call.children) {
    for (let i = 0; i < call.children.length; i++) {
      earliestStart = Math.min(earliestStart || Number.MAX_VALUE, getStart(call.children[i]));
    }
  }
  if (logs) {
    const callLogTimestamps = logs.map(log => log.timestamp);
    earliestStart = Math.min(earliestStart, Math.min(...callLogTimestamps));
  }
  return earliestStart;
}

export function getEnd(call: CallNode | TraceActivityTreeNode, logs?: LogItem[]) {
  let latestEnd = isLazyNode(call) ? Number.MIN_VALUE : call.start + call.duration;
  if ('logEvents' in call) {
    const logEventTimestamps = call.logEvents!.map(event => event.timestamp);
    latestEnd = Math.max(latestEnd, ...logEventTimestamps);
  }
  if (call.children) {
    for (let i = 0; i < call.children.length; i++) {
      latestEnd = Math.max(latestEnd || Number.MIN_VALUE, getEnd(call.children[i]));
    }
  }
  if (logs) {
    const callLogTimestamps = logs.map(log => log.timestamp);
    latestEnd = Math.max(latestEnd, Math.max(...callLogTimestamps));
  }
  return latestEnd;
}
