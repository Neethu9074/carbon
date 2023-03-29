/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useState, useCallback, useMemo } from 'react';

import {
  SuccessfulCallTreeResult,
  CALL_ID_HIDDEN_PARENTS,
  MAX_VISIBLE_NESTING_LEVELS,
  SearchIndex,
  TraceActivityTreeNodeWithParentId
} from 'in-applications/analyze/components/TraceDetails/components/CallTree/callTrees';
import { CallNode } from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';
import { limitVisibleNestingLevelsInTraceEnabled } from 'in-services/featureFlags';

/**
 * A hook for limiting the number of visible nesting levels in a call tree.
 *
 * @param callTreeResult successful call tree result (eager or lazy).
 * @returns [rootNode, onShowHiddenParentNestingLevel, onShowHiddenChildNestingLevel]
 *  rootNode - root of the visible subtree
 *  onShowHiddenParentNestingLevel - callback to be called to reveal a hidden parent level
 *  onShowHiddenChildNestingLevel - callback to be called to reveal hidden child nodes level
 */
export function useLimitVisibleNestingLevels<T extends CallNode | TraceActivityTreeNodeWithParentId>(
  callTreeResult: SuccessfulCallTreeResult<T>,
  openedCallId: string
): [T, () => void, (nodeId: string) => void] {
  const [lastRootNodeId, setLastRootNodeId] = useState(callTreeResult.data.id);
  const [lastOpenedCallId, setLastOpenedCallId] = useState(openedCallId);

  let [visibleRootNodeId, setVisibleRootNodeId] = useState<string>(() =>
    findVisibleRootNodeId(callTreeResult, openedCallId)
  );

  if (limitVisibleNestingLevelsInTraceEnabled) {
    const newLazyParentLoaded = lastRootNodeId !== callTreeResult.data.id;
    if (newLazyParentLoaded) {
      setLastRootNodeId(callTreeResult.data.id);
      if (isNotOnVisibleNestingLevel(callTreeResult, visibleRootNodeId, callTreeResult.data.id)) {
        visibleRootNodeId = findVisibleRootNodeId(callTreeResult, callTreeResult.data.id);
        setVisibleRootNodeId(visibleRootNodeId);
      }
    }

    const newOpenedCallId = lastOpenedCallId !== openedCallId;
    if (newOpenedCallId) {
      setLastOpenedCallId(openedCallId);
      if (isNotOnVisibleNestingLevel(callTreeResult, visibleRootNodeId, openedCallId)) {
        visibleRootNodeId = findVisibleRootNodeId(callTreeResult, openedCallId);
        setVisibleRootNodeId(visibleRootNodeId);
      }
    }
  }

  const onShowHiddenParentNestingLevel = useCallback(() => {
    if (!limitVisibleNestingLevelsInTraceEnabled) {
      return;
    }
    setVisibleRootNodeId(prevVisibleRootNodeId => {
      const prevVisibleRootNode = callTreeResult.searchIndex.get(prevVisibleRootNodeId);
      const parentId = prevVisibleRootNode?.parentId;
      if (parentId != null) {
        return parentId;
      }
      // this fallback will be used for fake root or lazy parent nodes
      return callTreeResult.data.id;
    });
  }, [callTreeResult]);

  const onShowHiddenChildNestingLevel = useCallback(
    callId => {
      if (!limitVisibleNestingLevelsInTraceEnabled) {
        return;
      }
      setVisibleRootNodeId(() => {
        const { data: rootNode, searchIndex } = callTreeResult;

        // always subtract two instead of just one nesting levels, because one nesting level will be
        // used by the "Load parent call" node
        const newRootNodeId = findParentNodeId(searchIndex, callId, MAX_VISIBLE_NESTING_LEVELS - 2);

        // fallback will be used for fake root or lazy parent nodes
        return newRootNodeId ?? rootNode.id;
      });
    },
    [callTreeResult]
  );

  const rootNode = useMemo(() => {
    let rootNode = callTreeResult.data;
    if (limitVisibleNestingLevelsInTraceEnabled && visibleRootNodeId !== rootNode.id) {
      const visibleRootNode = callTreeResult.searchIndex.get(visibleRootNodeId);
      if (visibleRootNode) {
        rootNode = {
          ...visibleRootNode,
          children: [visibleRootNode],
          id: CALL_ID_HIDDEN_PARENTS
        };
      }
    }
    return rootNode;
  }, [callTreeResult.data, callTreeResult.searchIndex, visibleRootNodeId]);

  return [rootNode, onShowHiddenParentNestingLevel, onShowHiddenChildNestingLevel];
}

function isNotOnVisibleNestingLevel(
  callTreeResult: SuccessfulCallTreeResult<CallNode | TraceActivityTreeNodeWithParentId>,
  visibleRootNodeId: string,
  nodeId: string,
  maxLevels: number = MAX_VISIBLE_NESTING_LEVELS
): boolean {
  if (nodeId === visibleRootNodeId) {
    return false;
  }
  let parentId = callTreeResult.searchIndex.get(nodeId)?.parentId;
  if (parentId != null && maxLevels > 0) {
    return isNotOnVisibleNestingLevel(callTreeResult, visibleRootNodeId, parentId, maxLevels - 1);
  }
  return true;
}

function findVisibleRootNodeId(
  callTreeResult: SuccessfulCallTreeResult<CallNode | TraceActivityTreeNodeWithParentId>,
  openedCallId: string
): string {
  if (!openedCallId) {
    return callTreeResult.data.id;
  }
  const newRootNodeId = findParentNodeId(callTreeResult.searchIndex, openedCallId, MAX_VISIBLE_NESTING_LEVELS - 1);
  return newRootNodeId ?? callTreeResult.data.id;
}

function findParentNodeId(
  searchIndex: SearchIndex<CallNode | TraceActivityTreeNodeWithParentId>,
  nodeId: string,
  nestingDistance: number
): string | null {
  let parentId = searchIndex.get(nodeId)?.parentId;

  if (parentId == null || !searchIndex.has(parentId)) {
    return null;
  }

  if (nestingDistance === 1) {
    return parentId;
  }
  return findParentNodeId(searchIndex, parentId, nestingDistance - 1);
}
