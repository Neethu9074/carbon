/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import shallowEqual from 'fbjs/lib/shallowEqual';
import { useObservable } from '@instana/hooks';

import { pendingResult, emptyArray, indeterminateProgress } from 'in-services/fixedObjects';

const initialState = {
  items: emptyArray,
  progress: indeterminateProgress,
  errors: emptyArray,
  awaitingData: true,
  canLoadMore: false,
  loadAfterCount: 0,
  loadBeforeCount: 0
};

export default function useLogsCursorPagination(create, deps = []) {
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
    loadAfterCount,
    loadBeforeCount,
    totalHits,
    progress,
    beforeKey,
    canLoadMore,
    nextBeforeKey,
    afterKey,
    nextAfterKey,
    errors,
    items,
    time
  } = shallowEqual(prevDeps, deps) ? state : initialState;

  const observable = useMemo(() => create({ beforeKey, afterKey, loadAfterCount, loadBeforeCount }), [
    beforeKey,
    afterKey,
    loadAfterCount,
    loadBeforeCount,
    ...deps
  ]);
  useEffect(() => setState(awaitItems), [observable, ...deps]);

  const result = useObservable(observable, [observable, ...deps]) ?? pendingResult;
  useEffect(() => setState(prev => updateResult(prev, result)), [result, ...deps]);

  const setAfterKey = useCallback(_afterKey =>
    setState(prev => ({
      ...prev,
      afterKey: _afterKey,
      loadAfterCount: loadAfterCount + 1
    }))
  );
  const loadMoreAfter = useCallback(() => setAfterKey(nextAfterKey), [nextAfterKey, loadAfterCount]);

  const setBeforeKey = useCallback(_beforeKey =>
    setState(prev => ({
      ...prev,
      beforeKey: _beforeKey,
      loadBeforeCount: loadBeforeCount + 1
    }))
  );
  const loadMoreBefore = useCallback(() => setBeforeKey(nextBeforeKey), [nextBeforeKey, loadBeforeCount]);

  return {
    totalHits,
    progress,
    loadMore: loadMoreAfter,
    loadAfterCount,
    loadBeforeCount,
    canLoadMore,
    loadMoreBefore,
    beforeKey,
    afterKey,
    errors,
    items,
    time
  };
}

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
    awaitingData: false,
    canLoadMore: true,
    nextBeforeKey: (data.next ?? data.beforeKey) || prev.beforeKey,
    nextAfterKey: (data.next ?? data.afterKey) || prev.afterKey,
    totalHits: data.totalHits ?? prev.totalHits,
    items: (prev.items ?? []).concat(data.items ?? [])
  };
}
