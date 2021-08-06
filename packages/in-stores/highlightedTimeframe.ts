/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import { navigationParameters$, mutateUrl } from 'in-stores/navigation';
import { Location } from 'in-stores/navigation/types';
import { createStore } from 'in-stores/store';

export const queryKey = 'tl.tf';

export type HighlightedTimeframe = [number, number] | null;

const store = createStore<HighlightedTimeframe>({
  name: 'timeline/highlightedTimeframe',
  initialValue: null
});

export const highlightedTimeframe$: Observable<HighlightedTimeframe> = store.observable.distinct(
  (a: HighlightedTimeframe, b: HighlightedTimeframe) => {
    if (!a && !b) {
      return false;
    }
    if (!a || !b) {
      return true;
    }
    return a[0] !== b[0] || a[1] !== b[1];
  }
);

// Do not use a tracking store to transform URL parameters into the store,
// since we want to debounce changes as we would otherwise generate lots and
// lots of URL changes.
navigationParameters$.subscribe(params => {
  const tf = params.query[queryKey];
  if (!tf) {
    store.mutateTo(null);
    return;
  }

  const parts = tf.split(',');
  if (parts.length !== 2) {
    return;
  }

  try {
    store.mutateTo([parseInt(parts[0], 10), parseInt(parts[1], 10)]);
  } catch (e) {
    // ignore
  }
});

highlightedTimeframe$
  .skipFirst()
  .debounce(500)
  .subscribe(tf => {
    mutateUrl(navParams => {
      addOrDeleteHighlightedTimeframeToParams(navParams, (tf && tf[0]) ?? 0, (tf && tf[1]) ?? 0);
      return navParams;
    });
  });

export function setHighlightedTimeframe(from: number, to: number) {
  store.mutateTo([Math.round(Math.min(from, to)), Math.round(Math.max(from, to))]);
}

export function clearHighlightedTimeframe() {
  store.mutateTo(null);
}

export function addOrDeleteHighlightedTimeframeToParams(params: Location, from: number, to: number) {
  if (from && to) {
    params.query[queryKey] = `${from},${to}`;
  } else {
    delete params.query[queryKey];
  }
}
