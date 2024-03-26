/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CallDetails, TraceActivityTreeNode, TraceActivityTreeNodeDetails } from '@instana/types';

import { CallNode } from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';

export const FAKE_ROOT_ID = 'fake_root';

export function isFakeRootCall(call: Pick<CallNode | TraceActivityTreeNode, 'id'>) {
  return call.id === FAKE_ROOT_ID;
}

export function hasOnlyExitSpan(call: Pick<TraceActivityTreeNodeDetails, 'spans'>) {
  return call.spans && call.spans.length == 1 && call.spans[0].kind == 'EXIT';
}

export function isUnknownTypeSpan(call: Pick<CallDetails, 'type'> | Pick<TraceActivityTreeNode, 'kind'>) {
  return (call as TraceActivityTreeNode).kind === 'UNKNOWN' || (call as CallDetails).type === 'UNDEFINED';
}

export function isInternalCall(call: Pick<CallDetails | TraceActivityTreeNode, 'endpoint'>) {
  return call.endpoint.type === 'INTERNAL';
}

export function isLog(call: Pick<TraceActivityTreeNode, 'model'>) {
  return call.model === 'LOG';
}
