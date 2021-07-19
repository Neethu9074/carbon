/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Disposable, Observable } from '@instana/observables';

export function dispose(subscription: Disposable) {
  if (subscription) {
    subscription.dispose();
  }
  return null;
}

export interface CombinedDataAndError<T> {
  data: T | null;
  error: any | null;
}

export function combineDataAndError<T>(upstream: Observable<T>): Observable<CombinedDataAndError<T>> {
  let subscription: Disposable | null;
  return create<CombinedDataAndError<T>>({
    start(observable) {
      subscription = upstream.subscribe(
        data => observable.emit({ data, error: null }),
        error => observable.emit({ data: null, error })
      );
    },

    stop() {
      subscription?.dispose();
      subscription = null;
    }
  }).freeze();
}
