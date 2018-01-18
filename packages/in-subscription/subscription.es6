// @flow
import memoize from 'in-services/util/memoizingObservableGenerator';
import Observable from 'reactive-observables/Observable';
import { create } from 'reactive-observables';
import { connection } from 'in-connection';

/**
 * A type for the arguments to createSubscription.
 *
 * Type params:
 * - Param: the type of object this subscription needs for getId and getData
 * - Result: the type of values the new subscription will emit (might be different from ServerResult when using
 *   transformData.
 */
// TODO Remove transformData, getScanner and replace by simple .map and .scan calls on the resulting observable
// TODO The resulting observable should be correctly typed. How?
export type CreateSubscriptionArgs<Param> = {
  eventId: string,
  getId: Param => string,
  getData: (subscriptionId: number, param: Param) => any,
  transformData?: Function, // ServerResult => Result,
  memoizeFor?: number,
  disposeSubscriptionOnDocumentHidden?: boolean,
  getScanner?: ?Function
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
export default function<Param, Result>({
  eventId,
  getId,
  getData,
  transformData = identity,
  memoizeFor = 10000,
  disposeSubscriptionOnDocumentHidden = true,
  getScanner
}: CreateSubscriptionArgs<Param>): Param => Observable<Result> {
  if (getScanner === undefined) {
    getScanner = null;
  }

  return memoize(
    createObservable.bind(null, eventId, getData, transformData, disposeSubscriptionOnDocumentHidden, getScanner),
    getId,
    memoizeFor
  );
}

function createObservable<Result>(
  event,
  getData,
  transformData,
  disposeSubscriptionOnDocumentHidden,
  getScanner,
  opts
): Observable<Result> {
  const subscriptionId = connection.getNewSubscriptionId();
  const subscriptionDescription = {
    subscriptionId,
    event,
    payload: getData(subscriptionId, opts),
    disposeSubscriptionOnDocumentHidden,
    listener: onData
  };

  const scan = getScanner != null ? getScanner(opts) : null;
  let scannedValue = null;
  const observable = create({
    start() {
      connection.subscribe(subscriptionDescription);
    },

    stop() {
      scannedValue = null;
      connection.unsubscribe(subscriptionId);
    }
  });

  return observable;

  function onData(data) {
    if (scan) {
      data = scannedValue = scan(scannedValue, data);
    }
    observable.emit(transformData(data));
  }
}

function identity(e) {
  return e;
}
