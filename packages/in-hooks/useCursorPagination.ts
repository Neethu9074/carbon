/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { pendingResult, emptyArray, indeterminateProgress } from 'in-services/fixedObjects';
import { Progress, Result, Error, CursorPaginatedWithNext, Cursor } from 'in-types';
import { shallowEquals } from 'in-services/util/object';

interface Item {
  cursor?: Cursor;
  metrics?: { [index: string]: number[][] };
  name?: string;
  timespamp?: number;
}
export interface State {
  totalRepresentedItemCount?: number;
  adjustedWindowSize?: number;
  canLoadMore: boolean;
  reloadCount: number;
  nextCursor?: Cursor;
  totalHits?: number;
  progress: Progress;
  cursor?: Object;
  errors: Error[];
  items: Item[];
  time?: number;
  awaitingData: boolean;
}

export interface PaginationReturn extends Partial<State> {
  loadMore: () => void;
  reload: () => void;
}

export default function useCursorPagination<T>(
  create: (v: Partial<State>) => Observable<T>,
  deps: React.DependencyList = []
): PaginationReturn {
  // If 'deps' change, the 'state' will be reset to the 'initialState' value. However, this 'state' change
  // won't be visible until the next re-render. In order to make sure that we won't use the stale value
  // of 'state', we need to track the previous value of 'deps' and perform a shallow comparison with the
  // current 'deps' value. If we detect a change, we will use 'initialState' instead of the stale 'state'
  // value.
  const [prevDeps, setPrevDeps] = useState<React.DependencyList>([]);
  useEffect(() => setPrevDeps(deps), deps);

  const [state, setState] = useState<State>(initialState);
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
  } = shallowEquals(prevDeps, deps) ? state : initialState;

  const observable: Observable<any> = useMemo(() => create({ cursor }), [cursor, reloadCount, ...deps]);
  useEffect(() => setState(awaitItems), [observable, ...deps]);

  const result: Result<CursorPaginatedWithNext<Item, Cursor>> =
    useObservable(observable, [observable, ...deps]) ?? pendingResult;
  useEffect(() => setState((prev: State) => updateResult(prev, result)), [result, ...deps]);

  // @ts-expect-error An argument for 'deps' was not provided.
  const setCursor: (cursor?: Cursor) => void = useCallback((cursor?: Cursor) =>
    setState(prev => ({ ...prev, cursor }))
  );
  const loadMore: () => void = useCallback(() => setCursor(nextCursor), [nextCursor]);
  const reload: () => void = useCallback(
    () => setState((prev: State) => ({ ...prev, reloadCount: prev.reloadCount + 1 })),
    []
  );

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

const initialState: State = {
  items: emptyArray as [],
  progress: indeterminateProgress,
  errors: emptyArray as [],
  awaitingData: true,
  canLoadMore: false,
  reloadCount: 0
};

function awaitItems(prev: State) {
  return { ...prev, awaitingData: true, canLoadMore: false };
}

function updateResult(prev: State, result: Result<CursorPaginatedWithNext<Item, Cursor>>): State {
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
