/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createStore } from 'in-stores/store';

const isLoadingStore = createStore({
  name: 'graphViewIsLoading',
  initialValue: true
});

export const isLoading$ = isLoadingStore.observable.distinct();

export function markAsLoading() {
  isLoadingStore.applyStateMutation(() => true);
}

export function markAsFinished() {
  isLoadingStore.applyStateMutation(() => false);
}

const statisticsStore = createStore({
  name: 'graphViewStatistics',
  initialValue: null
});

export const statistics$ = statisticsStore.observable;

export function resetStatistics() {
  statisticsStore.applyStateMutation(() => null);
}

export function setStatistics(nodeCount, edgeCount) {
  statisticsStore.applyStateMutation(() => {
    return {
      nodeCount,
      edgeCount
    };
  });
}
