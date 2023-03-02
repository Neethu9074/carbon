/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useEffect } from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  getRelatedCallsDetailsWithCursor,
  LazyParentNode,
  Relations
} from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';
import getCallDetails from 'in-applications/subscriptions/getCallDetails';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';

/**
 * Lazy parent nodes should use this hook to load its details as well as details of closest siblings to the already loaded
 * child call, which is the last loaded parent call.
 */
export function useLoadLazyParentNode({
  lazyParentNode,
  onParentAndSiblingCallsLoaded,
  startLoading,
  setStartLoading
}: {
  lazyParentNode: LazyParentNode;
  onParentAndSiblingCallsLoaded: any;
  startLoading: boolean;
  setStartLoading: (startLoading: boolean) => void;
}) {
  const { traceId, parentId, callId } = lazyParentNode;

  const parentCallResult =
    useObservable(() => (startLoading ? getCallDetails({ traceId, callId: parentId }) : just(null)), [
      traceId,
      parentId,
      startLoading
    ]) ?? pendingResult;

  const siblingCallsBeforeResult =
    useObservable(
      () =>
        startLoading
          ? getRelatedCallsDetailsWithCursor({ traceId, callId, relation: Relations.SIBLINGS_BEFORE })
          : just(null),
      [traceId, callId, startLoading]
    ) ?? pendingResult;

  const siblingCallsAfterResult =
    useObservable(
      () =>
        startLoading
          ? getRelatedCallsDetailsWithCursor({ traceId, callId, relation: Relations.SIBLINGS_AFTER })
          : just(null),
      [traceId, callId, startLoading]
    ) ?? pendingResult;

  useEffect(() => {
    if (isLoading(parentCallResult, siblingCallsBeforeResult, siblingCallsAfterResult)) {
      return;
    }

    setStartLoading(false);
    onParentAndSiblingCallsLoaded({ callId, parentCallResult, siblingCallsBeforeResult, siblingCallsAfterResult });
  }, [
    callId,
    onParentAndSiblingCallsLoaded,
    parentCallResult,
    setStartLoading,
    siblingCallsAfterResult,
    siblingCallsBeforeResult
  ]);
}
