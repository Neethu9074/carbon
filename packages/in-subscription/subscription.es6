// @flow

import memoize from 'in-services/util/memoizingObservableGenerator';
import { generateStableHash } from 'in-services/util/id';
import type { Observable } from 'reactive-observables';
import { create } from 'reactive-observables';
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
  memoizeFor?: number,
  disposeSubscriptionOnDocumentHidden?: boolean,
  transform?: (Observable<any>, PARAM) => Observable<RESULT>
};

/**
 * Returns a function (Param => Observable<Result>) that, when called, yields an observable of Result values.
 *
 * Type params:
 * - Param: the type of object this subscription needs for getId and getData
 * - ServerResult: the type of values the back end emits
 * - Result: the type of values the new subscription will emit (might be different from ServerResult when using
 *   transformData.
 */
export default function<PARAM, RESULT>({
  eventId,
  getId = generateStableHash,
  getData = defaultGetData,
  memoizeFor = 10000,
  disposeSubscriptionOnDocumentHidden = true,
  transform
}: CreateSubscriptionArgs<PARAM, RESULT>): PARAM => Observable<RESULT> {
  return memoize(
    createObservable.bind(null, eventId, getData, disposeSubscriptionOnDocumentHidden, transform),
    getId,
    memoizeFor
  );
}

function createObservable<PARAM, RESULT>(
  event: string,
  getData: (subscriptionId: number, param: PARAM) => any,
  disposeSubscriptionOnDocumentHidden?: boolean,
  transform?: (Observable<any>, PARAM) => Observable<RESULT>,
  opts: PARAM
): Observable<RESULT> {
  const subscriptionId = connection.getNewSubscriptionId();
  const subscriptionDescription = {
    subscriptionId,
    event,
    payload: getData(subscriptionId, opts),
    disposeSubscriptionOnDocumentHidden,
    listener: onData
  };

  const observable = create({
    start() {
      connection.subscribe(subscriptionDescription);
    },

    stop() {
      connection.unsubscribe(subscriptionId);
    }
  });

  if (transform) {
    return transform(observable, opts);
  }

  // $FlowFixMe: Just blindly pass the server result to the client. No additional validation is happening
  return (observable: Observable<RESULT>);

  function onData(data) {
    observable.emit(data);
  }
}

function defaultGetData(subscriptionId, params) {
  return {
    subscriptionId,
    ...params
  };
}
