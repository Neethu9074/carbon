/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { create } from '@instana/observables';

export function dispose(subscription) {
  if (subscription) {
    subscription.dispose();
  }
  return null;
}

export function combineDataAndError(upstream) {
  let subscription;
  return create({
    start(observable) {
      subscription = upstream.subscribe(
        data => observable.emit({ data, error: null }),
        error => observable.emit({ data: null, error })
      );
    },

    stop() {
      if (subscription) {
        subscription.dispose();
        subscription = null;
      }
    }
  });
}
