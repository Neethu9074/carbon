/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useCallback, useEffect, useState, useMemo } from 'react';

import { Relation, TraceActivityTreeNode } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  updateLazyCallTreeWithParentAndSiblingCalls,
  updateLazyCallTreeWithRelatedCalls,
  initLazyCallTree,
  LazyCallTree,
  Relations,
  FAKE_ROOT_CALL_ID,
  isCallNode
} from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';
import {
  EagerCallTreeResult,
  LazyCallTreeResult,
  TraceActivityTreeNodeWithParentId
} from 'in-applications/analyze/components/TraceDetails/components/CallTree/callTrees';
import searchForPathToSelectedNode from 'in-applications/analyze/components/TraceDetails/components/CallTree/searchForPathToSelectedNode';
import getRelatedCallsDetailsWithCursor from 'in-applications/subscriptions/getRelatedCallsDetailsWithCursor';
import { GetRelatedCallsDetailsResult } from 'in-applications/subscriptions/getRelatedCallsDetails';
import getCallDetails, { GetCallDetailsResult } from 'in-applications/subscriptions/getCallDetails';
import getTraceActivityTree from 'in-applications/subscriptions/getTraceActivityTree';
import { finishedProgress, pendingResult } from 'in-services/fixedObjects';
import { hasError, isLoading } from 'in-services/util/result';
import { Result } from 'in-types';

export interface OnRelatedCallsLoadedProps {
  callId: string;
  relation: Relation;
  getRelatedCallsDetailsResult: GetRelatedCallsDetailsResult;
}

export interface OnParentAndSiblingCallsLoadedProps {
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

/**
 * Initiates loading of a call tree and maintains the state of expanded nodes in the call tree.
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
  LazyCallTreeResult | EagerCallTreeResult,
  (params: OnRelatedCallsLoadedProps) => void,
  (params: OnParentAndSiblingCallsLoadedProps) => void,
  Set<string>,
  (callId: string) => void,
  (callId: string) => void
] {
  if (callIdOrMissing === 'ROOT') {
    callIdOrMissing = undefined;
  }

  const [expandedCalls, onCallExpanded, onCallCollapsed, resetExpandedCalls, expandCalls] = useExpandedCalls();

  // eager loading tree ------------------------------------------------------------------------------------------
  const eagerCallTreeResult =
    useObservable(!lazyLoading ? () => getTraceActivityTree({ id: traceId }) : just(null), [traceId, lazyLoading]) ??
    pendingResult;

  const eagerCallTreeResultWithSearchIndex = useMemo(() => {
    if ((!lazyLoading && isLoading(eagerCallTreeResult)) || hasError(eagerCallTreeResult)) {
      return eagerCallTreeResult;
    }
    return createEagerSearchIndexAndSetParentIds(eagerCallTreeResult);
  }, [lazyLoading, eagerCallTreeResult]);

  useEffect(() => {
    if (
      !lazyLoading &&
      (isLoading(eagerCallTreeResultWithSearchIndex) || hasError(eagerCallTreeResultWithSearchIndex))
    ) {
      return;
    }
    // auto expand all nodes from the root node to the selected call
    const nodesToExpand = searchForPathToSelectedNode(
      eagerCallTreeResultWithSearchIndex.data,
      node => node.id === callIdOrMissing
    );
    expandCalls(nodesToExpand);
  }, [lazyLoading, callIdOrMissing, eagerCallTreeResultWithSearchIndex, expandCalls]);

  // lazy loading tree ------------------------------------------------------------------------------------------
  const [lazyCallTreeResult, setLazyCallTreeResult] = useState<LazyCallTreeResult>(pendingResult);

  const callNotYetLoaded = !isCallAlreadyLoaded(lazyCallTreeResult.lazyCallTree, callIdOrMissing);

  useEffect(() => {
    if (lazyLoading && callNotYetLoaded) {
      // if the selected call was not loaded yet, reset both the lazy call tree and the expanded calls state
      resetExpandedCalls();
      setLazyCallTreeResult(pendingResult);
    }
  }, [lazyLoading, callNotYetLoaded, resetExpandedCalls]);

  useEffect(() => {
    if (lazyLoading && (isLoading(lazyCallTreeResult) || hasError(lazyCallTreeResult))) {
      return;
    }
    // auto expand all nodes from the root node to the selected call
    const nodesToExpand = searchForPathToSelectedNode(lazyCallTreeResult.data, node => node.id === callIdOrMissing);
    expandCalls(nodesToExpand);
  }, [lazyLoading, callIdOrMissing, eagerCallTreeResultWithSearchIndex, lazyCallTreeResult, expandCalls]);

  const callDetailsResult =
    useObservable(
      callNotYetLoaded && lazyLoading ? () => getCallDetails({ traceId, callId: callIdOrMissing }) : just(null),
      [traceId, callIdOrMissing, lazyLoading, callNotYetLoaded]
    ) ?? pendingResult;

  const callId = callDetailsResult.data?.id;
  const parentId = callDetailsResult.data?.parentId;
  const isRootCall = parentId == null && callDetailsResult.data?.foreignParentId == null;
  const loadChildren = lazyLoading && callNotYetLoaded && callId != null && callDetailsResult.data?.hasChildren;
  const loadSiblings = lazyLoading && callNotYetLoaded && callId != null && !isRootCall;
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
        return successfulLazyCallTreeResult(updatedTree);
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

        const parentId = parentCallResult.data?.id;
        if (parentId && updatedTree.searchIndex.has(parentId)) {
          // auto expand loaded parent
          onCallExpanded(parentId);
        }

        return successfulLazyCallTreeResult(updatedTree);
      });
    },
    [onCallExpanded]
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

    setLazyCallTreeResult(successfulLazyCallTreeResult(lazyCallTree));
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

  return [
    lazyLoading ? lazyCallTreeResult : eagerCallTreeResultWithSearchIndex,
    onRelatedCallsLoaded,
    onParentAndSiblingCallsLoaded,
    expandedCalls,
    onCallExpanded,
    onCallCollapsed
  ];
}

function isCallAlreadyLoaded(lazyCallTree?: LazyCallTree, callId?: string): boolean {
  if (!lazyCallTree) {
    return false;
  }
  if (callId == null) {
    return isRootCallLoaded(lazyCallTree);
  }
  return lazyCallTree.searchIndex.get(callId) != null;
}

function isRootCallLoaded(lazyCallTree: LazyCallTree): boolean {
  return (
    (isCallNode(lazyCallTree.root) &&
      lazyCallTree.root.parentId == null &&
      lazyCallTree.root.foreignParentId == null) ||
    lazyCallTree.searchIndex.get(FAKE_ROOT_CALL_ID) != null
  );
}

function successfulLazyCallTreeResult(lazyCallTree: LazyCallTree): LazyCallTreeResult {
  return {
    progress: finishedProgress,
    errors: [],
    data: lazyCallTree.root,
    lazyCallTree,
    searchIndex: lazyCallTree.searchIndex
  };
}

function createEagerSearchIndexAndSetParentIds(
  eagerCallTreeResult: Result<TraceActivityTreeNode>
): EagerCallTreeResult {
  const searchIndex = new Map<string, TraceActivityTreeNodeWithParentId>();
  const node = populateEagerSearchIndexAndSetParentIds(searchIndex, eagerCallTreeResult.data);
  return {
    ...eagerCallTreeResult,
    ...(node != null && { data: node }),
    searchIndex
  };
}

function populateEagerSearchIndexAndSetParentIds(
  searchIndex: Map<string, TraceActivityTreeNodeWithParentId>,
  node?: TraceActivityTreeNode
): TraceActivityTreeNodeWithParentId | null {
  let nodeCopy: TraceActivityTreeNodeWithParentId | null = null;
  if (node != null) {
    nodeCopy = { ...node } as TraceActivityTreeNodeWithParentId;
    nodeCopy.children = [];
    if (nodeCopy.model !== 'LOG') {
      searchIndex.set(nodeCopy.id, nodeCopy);
    }
    node.children.forEach(child => {
      const newChild = populateEagerSearchIndexAndSetParentIds(searchIndex, child);
      if (newChild) {
        newChild.parentId = node.id;
        nodeCopy!.children.push(newChild);
      }
    });
  }
  return nodeCopy;
}

/**
 * Hook used for tracking of the expanded state of nodes within the call tree. We can't keep the expanded
 * state locally within the component representing individual calls, because after loading a lazy parent,
 * all child components will get remounted and we would thus lose all previous state.
 */
function useExpandedCalls(): [
  Set<string>,
  (callId: string) => void,
  (callId: string) => void,
  () => void,
  (callIds: string[]) => void
] {
  const [expandedCalls, setExpandedCalls] = useState<Set<string>>(new Set());

  /**
   * This callback should be called after expanding a node in the call tree.
   */
  const onCallExpanded = useCallback(
    (callId: string) =>
      setExpandedCalls(prevSet => {
        if (prevSet.has(callId)) {
          return prevSet;
        }
        return new Set(Array.from(prevSet.keys())).add(callId);
      }),
    [setExpandedCalls]
  );

  /**
   * This callback should be called after collapsing a node in the call tree.
   */
  const onCallCollapsed = useCallback(
    (callId: string) =>
      setExpandedCalls(prevSet => {
        if (!prevSet.has(callId)) {
          return prevSet;
        }
        const newSet = new Set(Array.from(prevSet.keys()));
        newSet.delete(callId);
        return newSet;
      }),
    [setExpandedCalls]
  );

  /**
   * This callback will be used internally within this module to reset the state when the lazy call tree is reloaded.
   */
  const resetExpandedCalls = useCallback(() => setExpandedCalls(new Set()), [setExpandedCalls]);

  /**
   * This callback will be used internally within this module to auto expand all nodes in the call tree between the root node and the selected call.
   */
  const expandCalls = useCallback(
    callsToExpand => {
      setExpandedCalls(prevSet => new Set([...Array.from(prevSet.values()), ...callsToExpand]));
    },
    [setExpandedCalls]
  );

  return [expandedCalls, onCallExpanded, onCallCollapsed, resetExpandedCalls, expandCalls];
}
