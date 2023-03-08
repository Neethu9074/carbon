/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useCallback, useEffect, useState } from 'react';

import { Relation, TraceActivityTreeNode } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  updateLazyCallTreeWithParentAndSiblingCalls,
  updateLazyCallTreeWithRelatedCalls,
  initLazyCallTree,
  LazyCallTree,
  Relations,
  CallNode
} from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';
import getRelatedCallsDetailsWithCursor from 'in-applications/subscriptions/getRelatedCallsDetailsWithCursor';
import { GetRelatedCallsDetailsResult } from 'in-applications/subscriptions/getRelatedCallsDetails';
import getCallDetails, { GetCallDetailsResult } from 'in-applications/subscriptions/getCallDetails';
import getTraceActivityTree from 'in-applications/subscriptions/getTraceActivityTree';
import { finishedProgress, pendingResult } from 'in-services/fixedObjects';
import { hasError, isLoading } from 'in-services/util/result';
import { Result } from 'in-types';

interface OnRelatedCallsLoadedProps {
  callId: string;
  relation: Relation;
  getRelatedCallsDetailsResult: GetRelatedCallsDetailsResult;
}

interface OnParentAndSiblingCallsLoadedProps {
  callId: string;
  parentCallResult: GetCallDetailsResult;
  siblingCallsBeforeResult: GetRelatedCallsDetailsResult;
  siblingCallsAfterResult: GetRelatedCallsDetailsResult;
}

interface UseLoadCallTreeProps {
  traceId: string;
  callId?: string;
  lazyLoading: boolean;
}

interface LazyCallTreeResult extends Result<CallNode> {
  lazyCallTree?: LazyCallTree;
}

/**
 * Initiates loading of a call tree.
 *
 * @param traceId     Specifies which trace to load.
 * @param callId      Specifies which call to load first, if lazy loading is selected. If callId is missing or 'ROOT', the root call will be loaded first.
 * @param lazyLoading If true the call tree will be loaded lazily. This is especially useful for large traces.
 */
export function useLoadCallTree({
  traceId,
  callId: callIdOrMissing,
  lazyLoading
}: UseLoadCallTreeProps): [
  LazyCallTreeResult | Result<TraceActivityTreeNode>,
  (params: OnRelatedCallsLoadedProps) => void,
  (params: OnParentAndSiblingCallsLoadedProps) => void
] {
  if (callIdOrMissing === 'ROOT') {
    callIdOrMissing = undefined;
  }

  // eager loading tree
  const eagerCallTreeResult =
    useObservable(!lazyLoading ? () => getTraceActivityTree({ id: traceId }) : just(null), [traceId, lazyLoading]) ??
    pendingResult;

  // lazy loading tree
  const [lazyCallTreeResult, setLazyCallTreeResult] = useState<LazyCallTreeResult>(pendingResult);

  const callDetailsResult =
    useObservable(lazyLoading ? () => getCallDetails({ traceId, callId: callIdOrMissing }) : just(null), [
      traceId,
      callIdOrMissing,
      lazyLoading
    ]) ?? pendingResult;

  const callId = callDetailsResult.data?.id;
  const parentId = callDetailsResult.data?.parentId;
  const isRootCall = parentId == null && callDetailsResult.data?.foreignParentId == null;
  const loadChildren = lazyLoading && callId != null && callDetailsResult.data?.hasChildren;
  const loadSiblings = lazyLoading && callId != null && !isRootCall;
  const loadParent = loadSiblings && parentId != null;

  const childCallsDetailsResult =
    useObservable(
      loadChildren
        ? () => getRelatedCallsDetailsWithCursor({ traceId, callId: callId, relation: Relations.CHILDREN })
        : just(null),
      [traceId, callId, loadChildren]
    ) ?? pendingResult;

  const siblingCallsBeforeResult =
    useObservable(
      loadSiblings
        ? () => getRelatedCallsDetailsWithCursor({ traceId, callId: callId, relation: Relations.SIBLINGS_BEFORE })
        : just(null),
      [traceId, callId, loadSiblings]
    ) ?? pendingResult;

  const siblingCallsAfterResult =
    useObservable(
      loadSiblings
        ? () => getRelatedCallsDetailsWithCursor({ traceId, callId: callId, relation: Relations.SIBLINGS_AFTER })
        : just(null),
      [traceId, callId, loadSiblings]
    ) ?? pendingResult;

  const parentCallDetailsResult =
    useObservable(loadParent ? getCallDetails({ traceId, callId: parentId }) : just(null), [
      traceId,
      parentId,
      loadParent
    ]) ?? pendingResult;

  const onRelatedCallsLoaded = useCallback(
    ({ callId, relation, getRelatedCallsDetailsResult }: OnRelatedCallsLoadedProps) => {
      setLazyCallTreeResult(lazyCallTreeResult => {
        if (isLoading(getRelatedCallsDetailsResult) || !lazyCallTreeResult.lazyCallTree) {
          return lazyCallTreeResult;
        }
        const updatedTree = updateLazyCallTreeWithRelatedCalls(
          lazyCallTreeResult.lazyCallTree,
          callId,
          relation,
          getRelatedCallsDetailsResult
        );
        return successfulResult(updatedTree);
      });
    },
    []
  );

  const onParentAndSiblingCallsLoaded = useCallback(
    ({
      callId,
      parentCallResult,
      siblingCallsBeforeResult,
      siblingCallsAfterResult
    }: OnParentAndSiblingCallsLoadedProps) => {
      setLazyCallTreeResult(lazyCallTreeResult => {
        if (
          isLoading(parentCallResult, siblingCallsBeforeResult, siblingCallsAfterResult) ||
          !lazyCallTreeResult.lazyCallTree
        ) {
          return lazyCallTreeResult;
        }
        const updatedTree = updateLazyCallTreeWithParentAndSiblingCalls(
          lazyCallTreeResult.lazyCallTree,
          callId,
          parentCallResult,
          siblingCallsBeforeResult,
          siblingCallsAfterResult
        );
        return successfulResult(updatedTree);
      });
    },
    []
  );

  useEffect(() => {
    if (
      lazyLoading &&
      (isLoading(callDetailsResult) ||
        (loadChildren && isLoading(childCallsDetailsResult)) ||
        (loadSiblings && isLoading(siblingCallsBeforeResult, siblingCallsAfterResult)) ||
        (loadParent && isLoading(parentCallDetailsResult)))
    ) {
      return;
    }

    if (hasError(callDetailsResult)) {
      setLazyCallTreeResult({
        progress: finishedProgress,
        errors: callDetailsResult.errors
      });
      return;
    }

    let lazyCallTree: LazyCallTree = initLazyCallTree({ callDetails: callDetailsResult.data, traceId });

    if (loadChildren) {
      lazyCallTree = updateLazyCallTreeWithRelatedCalls(
        lazyCallTree,
        callId,
        Relations.CHILDREN,
        childCallsDetailsResult
      );
    }

    if (loadSiblings || loadParent) {
      lazyCallTree = updateLazyCallTreeWithParentAndSiblingCalls(
        lazyCallTree,
        callId,
        parentCallDetailsResult,
        siblingCallsBeforeResult,
        siblingCallsAfterResult
      );
    }

    setLazyCallTreeResult(successfulResult(lazyCallTree));
  }, [
    callDetailsResult,
    callId,
    childCallsDetailsResult,
    lazyLoading,
    loadChildren,
    loadSiblings,
    loadParent,
    parentCallDetailsResult,
    parentId,
    siblingCallsAfterResult,
    siblingCallsBeforeResult,
    traceId,
    setLazyCallTreeResult
  ]);

  return [lazyLoading ? lazyCallTreeResult : eagerCallTreeResult, onRelatedCallsLoaded, onParentAndSiblingCallsLoaded];
}

function successfulResult(lazyCallTree: LazyCallTree): LazyCallTreeResult {
  return {
    progress: finishedProgress,
    errors: [],
    data: lazyCallTree.root,
    lazyCallTree
  };
}
