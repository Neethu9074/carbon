import { useState, useEffect, useCallback, useMemo } from 'react';

import { pendingResult, emptyArray, indeterminateProgress } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';

export default function useCursorPagination(create, deps = []) {
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
  } = state;
  const observable = useMemo(() => create({ cursor }), [cursor, reloadCount, ...deps]);
  useEffect(() => setState(awaitItems), [observable]);

  const result = useObservable(observable, [observable]) ?? pendingResult;
  useEffect(() => setState(prev => updateResult(prev, result)), [result]);

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
    time
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
    totalRepresentedItemCount: data.totalRepresentedItemCount || prev.totalRepresentedItemCount,
    awaitingData: false,
    canLoadMore: data.canLoadMore,
    nextCursor: data.next ?? data.items?.[data.items.length - 1]?.cursor,
    totalHits: data.totalHits || prev.totalHits,
    items: (prev.items ?? []).concat(data.items ?? [])
  };
}
