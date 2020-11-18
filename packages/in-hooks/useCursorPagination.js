import { useState, useEffect, useCallback, useMemo } from 'react';
import shallowEqual from 'fbjs/lib/shallowEqual';

import { pendingResult, emptyArray, indeterminateProgress } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';

export default function useCursorPagination(create, deps = []) {
  // If 'deps' change, the 'state' will be reset to the 'initialState' value. However, this 'state' change
  // won't be visible until the next re-render. In order to make sure that we won't use the stale value
  // of 'state', we need to track the previous value of 'deps' and perform a shallow comparison with the
  // current 'deps' value. If we detect a change, we will use 'initialState' instead of the stale 'state'
  // value.
  const [prevDeps, setPrevDeps] = useState([]);
  useEffect(() => setPrevDeps(deps), deps);

  const [state, setState] = useState(initialState);
  useEffect(() => setState(initialState), deps);

  const {
    totalRepresentedItemCount,
    adjustedWindowSize,
    canLoadMore,
    reloadCount,
    nextCursor,
    totalHits,
    progress,
    cursor,
    errors,
    items,
    time
  } = shallowEqual(prevDeps, deps) ? state : initialState;

  const observable = useMemo(() => create({ cursor }), [cursor, reloadCount, ...deps]);
  useEffect(() => setState(awaitItems), [observable, ...deps]);

  const result = useObservable(observable, [observable, ...deps]) ?? pendingResult;
  useEffect(() => setState(prev => updateResult(prev, result)), [result, ...deps]);

  const setCursor = useCallback(cursor => setState(prev => ({ ...prev, cursor })));
  const loadMore = useCallback(() => setCursor(nextCursor), [nextCursor]);
  const reload = useCallback(() => setState(prev => ({ ...prev, reloadCount: prev.reloadCount + 1 })));

  return {
    totalRepresentedItemCount,
    adjustedWindowSize,
    canLoadMore,
    totalHits,
    progress,
    loadMore,
    errors,
    reload,
    items,
    time,
    cursor
  };
}

const initialState = {
  items: emptyArray,
  progress: indeterminateProgress,
  awaitingData: true,
  canLoadMore: false,
  reloadCount: 0
};

function awaitItems(prev) {
  return { ...prev, awaitingData: true, canLoadMore: false };
}

function updateResult(prev, result) {
  if (!prev.awaitingData) {
    return prev;
  }
  const { data } = result;
  if (!data) {
    return {
      ...prev,
      ...result
    };
  }
  return {
    ...prev,
    ...result,
    totalRepresentedItemCount: data.totalRepresentedItemCount ?? prev.totalRepresentedItemCount,
    awaitingData: false,
    canLoadMore: data.canLoadMore,
    nextCursor: data.next ?? data.items?.[data.items.length - 1]?.cursor,
    totalHits: data.totalHits ?? prev.totalHits,
    items: (prev.items ?? []).concat(data.items ?? [])
  };
}
