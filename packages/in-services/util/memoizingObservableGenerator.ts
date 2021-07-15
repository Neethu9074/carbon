/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable, DelayedStopTti } from '@instana/observables';

export type ObservableCreator<ARG, RESULT> = (arg: ARG) => Observable<RESULT>;
export type IdGenerator<ARG> = (arg: ARG) => string;
export type TtiGenerator<ARG, RESULT> = (arg: ARG[], lastEmittedValue?: RESULT) => number;

export default function memoize<ARG, RESULT>(
  createObservable: ObservableCreator<ARG, RESULT>,
  idGenerator: IdGenerator<ARG>,
  tti: number | TtiGenerator<ARG, RESULT> = 10000
): ObservableCreator<ARG, RESULT> {
  const cache = new Map();

  const memoizedObservableCreator: ObservableCreator<ARG, RESULT> = function() {
    // We don't want to call the function any other way, because we
    // do not want to incur a performance penalty because of static types.
    // @ts-ignore
    const id = idGenerator.apply(this, arguments);
    if (cache.has(id)) {
      return cache.get(id);
    }

    let delayedStopTti: DelayedStopTti<RESULT>;
    if (typeof tti === 'function') {
      // non-deopt arguments copy
      const args = new Array(arguments.length);
      for (let i = 0; i < arguments.length; i++) {
        args[i] = arguments[i];
      }
      delayedStopTti = lastEmittedValue => tti(args, lastEmittedValue);
    } else {
      delayedStopTti = tti;
    }

    // We don't want to call the function any other way, because we
    // do not want to incur a performance penalty because of static types.
    // @ts-ignore
    const observable = createObservable.apply(this, arguments)
      .delayedStop(delayedStopTti, () => cache.delete(id));
    cache.set(id, observable);
    return observable;
  };

  return memoizedObservableCreator;
}
