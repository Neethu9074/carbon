import { useState, useEffect, useCallback, useMemo } from 'react';

import useObservable from 'in-hooks/useObservable';
import { pendingResult, emptyArray, indeterminateProgress } from 'in-services/fixedObjects';

export default function useCursorPagination(create, deps = []) {
  const [state, setState] = useState(initialState);
  const { cursor, nextCursor } = state;
  const observable = useMemo(() => create({ cursor }), [create, cursor, ...deps]);
  const { data, progress, errors, time, adjustedWindowSize } = useObservable(observable, [observable]) ?? pendingResult;
  useEffect(() => setState(initialState), deps);
  useEffect(() => {
    setState(prev => ({
      ...prev,
      items: (prev.items ?? []).concat(data?.items ?? []),
      totalHits: data?.totalHits ?? prev.totalHits,
      totalRepresentedItemCount: data?.totalRepresentedItemCount ?? prev.totalRepresentedItemCount,
      canLoadMore: data?.canLoadMore,
      nextCursor: data?.next ?? data?.items?.[data?.items.length - 1]?.cursor
    }));
  }, [data]);
  useEffect(() => {
    setState(prev => ({
      ...prev,
      progress,
      errors,
      time,
      adjustedWindowSize
    }));
  }, [progress, errors, time, adjustedWindowSize]);

  const setCursor = useCallback(cursor => setState(prev => ({ ...prev, cursor })));
  const loadMore = useCallback(() => setCursor(nextCursor), [nextCursor]);
  const reload = useCallback(() => setCursor(undefined));

  return {
    ...state,
    loadMore,
    reload
  };
}

const initialState = {
  items: emptyArray,
  progress: indeterminateProgress
};
