/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { Progress, Result, Error, CursorPaginatedWithNext, CursorPaginatedResult, Cursor, Cursorific } from 'in-types';
import { pendingResult, emptyArray, indeterminateProgress } from 'in-services/fixedObjects';
import { shallowEquals } from 'in-services/util/object';

export type GetCursorPaginated<CURSOR extends Cursor, ITEM extends Cursorific<CURSOR>> = (opts: {
  cursor?: Cursor;
}) => Observable<Result<CursorPaginatedResult<ITEM>>>;

export type GetCursorPaginatedWithNext<CURSOR extends Cursor, ITEM> = (opts: {
  cursor?: Cursor;
}) => Observable<Result<CursorPaginatedWithNext<ITEM, CURSOR>>>;

type SupportedResponseFormats<ITEM, CURSOR> = CursorPaginatedWithNext<ITEM, CURSOR> | CursorPaginatedResult<ITEM>;

export interface State<CURSOR, ITEM> {
  cursor?: CURSOR;
  nextCursor?: CURSOR;
  items: ITEM[];
  errors: Error[];
  progress: Progress;

  awaitingData: boolean;
  canLoadMore: boolean;
  reloadCount: number;

  totalRepresentedItemCount?: number;
  adjustedWindowSize?: number;
  totalHits?: number;
  time?: number;
}

const initialState: State<any, any> = {
  items: emptyArray as [],
  progress: indeterminateProgress,
  errors: emptyArray as [],
  awaitingData: true,
  canLoadMore: false,
  reloadCount: 0
};

export default function useCursorPagination<CURSOR extends Cursor, ITEM extends Cursorific<CURSOR>>(
  create: GetCursorPaginated<CURSOR, ITEM>,
  deps?: React.DependencyList
): State<CURSOR, ITEM>;
export default function useCursorPagination<CURSOR extends Cursor, ITEM>(
  create: GetCursorPaginatedWithNext<CURSOR, ITEM>,
  deps?: React.DependencyList
): State<CURSOR, ITEM>;
export default function useCursorPagination<CURSOR extends Cursor, ITEM>(
  create: GetCursorPaginated<CURSOR, ITEM> | GetCursorPaginatedWithNext<CURSOR, ITEM>,
  deps: React.DependencyList = []
): State<CURSOR, ITEM> & {
  loadMore: () => void;
  reload: () => void;
} {
  // If 'deps' change, the 'state' will be reset to the 'initialState' value. However, this 'state' change
  // won't be visible until the next re-render. In order to make sure that we won't use the stale value
  // of 'state', we need to track the previous value of 'deps' and perform a shallow comparison with the
  // current 'deps' value. If we detect a change, we will use 'initialState' instead of the stale 'state'
  // value.
  const [prevDeps, setPrevDeps] = useState<React.DependencyList>([]);
  // Dependencies are externally provided
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPrevDeps(deps), deps);

  const [state, setState] = useState<State<CURSOR, ITEM>>(initialState);
  // Dependencies are externally provided
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setState(initialState), deps);

  const {
    totalRepresentedItemCount,
    adjustedWindowSize,
    canLoadMore,
    reloadCount,
    totalHits,
    progress,
    cursor,
    errors,
    items,
    time,
    awaitingData
  } = shallowEquals(prevDeps, deps) ? state : initialState;

  const observable: Observable<Result<SupportedResponseFormats<ITEM, CURSOR>>> = useMemo(
    () => create({ cursor }),
    // eslint cannot statically analyze the following case
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cursor, reloadCount, ...deps]
  );
  // eslint cannot statically analyze the following case
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setState(awaitItems), [observable, ...deps]);

  const result: Result<SupportedResponseFormats<ITEM, CURSOR>> =
    useObservable(observable, [observable, ...deps]) ?? pendingResult;
  useEffect(() => setState((prev: State<CURSOR, ITEM>) => updateResult(prev, result)), [
    result,
    // eslint cannot statically analyze the following case
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...deps
  ]);

  const loadMore: () => void = useCallback(
    () => setState((prev: State<CURSOR, ITEM>) => ({ ...prev, cursor: prev.nextCursor, nextCursor: undefined })),
    []
  );
  const reload: () => void = useCallback(
    () => setState((prev: State<CURSOR, ITEM>) => ({ ...prev, reloadCount: prev.reloadCount + 1 })),
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
    cursor,
    reloadCount,
    awaitingData
  };
}

function awaitItems<CURSOR, ITEM>(prev: State<CURSOR, ITEM>) {
  return { ...prev, awaitingData: true, canLoadMore: false };
}

function updateResult<CURSOR extends Cursor, ITEM extends Cursorific<CURSOR> | Object>(
  prev: State<CURSOR, ITEM>,
  result: Result<SupportedResponseFormats<ITEM, CURSOR>>
): State<CURSOR, ITEM> {
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

  let nextCursor: CURSOR | undefined;
  if ('next' in data && data.next) {
    nextCursor = data.next;
  } else {
    const item = data.items?.[data.items.length - 1];
    if (item && 'cursor' in item) {
      nextCursor = item.cursor;
    }
  }

  return {
    ...prev,
    ...result,
    totalRepresentedItemCount: data.totalRepresentedItemCount ?? prev.totalRepresentedItemCount,
    awaitingData: false,
    canLoadMore: data.canLoadMore,
    nextCursor,
    totalHits: data.totalHits ?? prev.totalHits,
    items: (prev.items ?? []).concat(data.items ?? [])
  };
}
