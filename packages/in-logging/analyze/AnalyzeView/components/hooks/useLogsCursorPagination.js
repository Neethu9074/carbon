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
  loadAfterCount: 0
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

  const { loadAfterCount, progress, canLoadMore, afterKey, nextAfterKey, errors, items, time } = shallowEqual(
    prevDeps,
    deps
  )
    ? state
    : initialState;

  const observable = useMemo(() => create({ afterKey, loadAfterCount }), [afterKey, loadAfterCount, ...deps]);
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

  return {
    progress,
    loadMore: loadMoreAfter,
    loadAfterCount,
    canLoadMore,
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
  // handles initial result.response.loading and error results
  if (!data) {
    return {
      ...prev,
      ...result
    };
  }

  const isStreamingData = data.percentage < 1;

  return {
    ...prev,
    ...result,

    progress: {
      loading: isStreamingData,
      percentage: data.percentage
    },
    awaitingData: isStreamingData,

    // don't provide a load more button until the streaming of the current data is done
    canLoadMore: !isStreamingData,

    nextAfterKey: (data.next ?? data.afterKey) || prev.afterKey,
    items: concat(prev.items, data.items)
  };
}

// Some subscriptions will stream data and return the items found so far.
// So the different results can contain duplicates which must be filtered.
function concat(logItems1 = [], logItems2 = []) {
  const allIds = new Set(logItems1.map(getId));
  return logItems1.slice().concat(logItems2.filter(item => !allIds.has(getId(item))));
}
function getId(item) {
  return item.itemId;
}
