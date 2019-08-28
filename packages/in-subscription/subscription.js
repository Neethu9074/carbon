// @flow
import type { Observable } from 'reactive-observables';
import { create } from 'reactive-observables';

import memoize from 'in-services/util/memoizingObservableGenerator';
import { generateStableHash } from 'in-services/util/id';
import { connection } from 'in-connection';

/**
 * A type for the arguments to createSubscription.
 *
 * Type params:
 * - Param: the type of object this subscription needs for getId and getData
 * - Result: the type of values the new subscription will emit
 */
export type CreateSubscriptionArgs<PARAM, RESULT> = {
  eventId: string,
  getId?: PARAM => string,
  getData: (subscriptionId: number, param: PARAM) => any,
  // A value < 1 will indicate that memoization should be disabled.
  memoizeFor?: number | Function,
  disposeSubscriptionOnDocumentHidden?: boolean,
  transform?: (Observable<any>, PARAM) => Observable<RESULT>,
  onStart?: Function,
  onStop?: Function,
  onData?: Function
};

/**
 * Returns a function (Param => Observable<Result>) that, when called, yields an observable of Result values.
 *
 * Type params:
 * - PARAM: the type of object this subscription needs for getId and getData
 * - RESULT: the type of values the new subscription will emit
 */
export default function<PARAM, RESULT>({
  eventId,
  getId = generateStableHash,
  getData = defaultGetData,
  memoizeFor,
  disposeSubscriptionOnDocumentHidden = true,
  transform,
  onStart,
  onStop,
  onData
}: CreateSubscriptionArgs<PARAM, RESULT>): PARAM => Observable<RESULT> {
  const observableCreator = createObservable.bind(
    null,
    eventId,
    getData,
    disposeSubscriptionOnDocumentHidden,
    transform,
    onStart,
    onStop,
    onData
  );
  if (memoizeFor != null && typeof memoizeFor === 'number' && memoizeFor < 1) {
    return observableCreator;
  }

  return memoize(observableCreator, getId, memoizeFor == null ? 10000 : memoizeFor);
}

function createObservable<PARAM, RESULT>(
  event: string,
  getData: (subscriptionId: number, param: PARAM) => any,
  disposeSubscriptionOnDocumentHidden?: boolean,
  transform?: (Observable<any>, PARAM) => Observable<RESULT>,
  onStart?: Function,
  onStop?: Function,
  onDataSideEffect?: Function,
  opts: PARAM
): Observable<RESULT> {
  const subscriptionId = connection.getNewSubscriptionId();
  const subscriptionDescription = {
    subscriptionId,
    event,
    payload: getData(subscriptionId, opts),
    disposeSubscriptionOnDocumentHidden,
    listener: onData,
    initializationCallStack: new Error('Subscription failed. Stack shows subscription initialization.')
  };

  const observable = create({
    start() {
      if (onStart) {
        onStart(subscriptionDescription);
      }
      connection.subscribe(subscriptionDescription);
    },

    stop() {
      if (onStop) {
        onStop(subscriptionDescription);
      }
      connection.unsubscribe(subscriptionId);
    }
  });

  if (transform) {
    return transform(observable, opts);
  }

  // $FlowFixMe: Just blindly pass the server result to the client. No additional validation is happening
  return (observable: Observable<RESULT>);

  function onData(data) {
    if (onDataSideEffect) {
      onDataSideEffect(subscriptionDescription, data);
    }
    observable.emit(data);
  }
}

function defaultGetData(subscriptionId, params) {
  return {
    subscriptionId,
    ...params
  };
}
