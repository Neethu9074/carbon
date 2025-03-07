/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Observable } from '@instana/observables';
import { generateStableHash } from '@instana/utils';

import memoize, { IdGenerator, TtiGenerator } from 'in-services/util/memoizingObservableGenerator';
import { SubscribeOptions } from 'in-connection/types';
import { connection } from 'in-connection';

export interface Options<IN, OUT> {
  eventId: string;

  getId?: IdGenerator<IN>;

  /**
   * Use this function to create the subscription request payload
   */
  getData?(subscriptionId: number, opts?: IN): Object;

  memoizeFor?: number | TtiGenerator<IN, OUT>;

  disposeSubscriptionOnDocumentHidden?: boolean;

  transform?(observable: Observable<OUT>, opts?: IN): Observable<OUT>;

  /**
   * A side-effect that triggers when creating the observable for the first time
   * (per-request). Can be used to track when a request is send to the backend.
   */
  onStart?(subscribeOptions: SubscribeOptions<OUT>): void;

  /**
   * A side-effect that triggers when disposing the observable (per-request).
   * Can be used to track when a memoized observable is disposed.
   */
  onStop?(subscribeOptions: SubscribeOptions<OUT>): void;

  /**
   * A side-effect to trigger whenever data is received from the backend.
   */
  onData?(subscribeOptions: SubscribeOptions<OUT>, data: OUT): void;
  actionIds?: [];
}

export default function subscribe<IN, OUT>(options: Options<IN, OUT>): (parameter: IN) => Observable<OUT> {
  const { getId = generateStableHash, memoizeFor } = options;

  const observableCreator = (subscriptionParameters?: IN) => createObservable(options, subscriptionParameters);

  if (memoizeFor != null && typeof memoizeFor === 'number' && memoizeFor < 1) {
    return observableCreator;
  }

  return memoize(observableCreator, getId, memoizeFor == null ? 10000 : memoizeFor);
}

function createObservable<IN, OUT>(
  {
    eventId,
    getData = defaultGetData,
    disposeSubscriptionOnDocumentHidden = true,
    transform,
    onStart,
    onStop,
    onData: onDataSideEffect
  }: Options<IN, OUT>,
  opts?: IN
) {
  const subscriptionId = connection.getNewSubscriptionId();
  const subscribeOptions: SubscribeOptions<OUT> = {
    subscriptionId,
    event: eventId,
    payload: getData(subscriptionId, opts),
    disposeSubscriptionOnDocumentHidden,
    listener: onData,
    initializationCallStack: __DEV__
      ? new Error('Subscription failed. Stack shows subscription initialization.')
      : undefined
  };

  const observable = create<OUT>({
    start() {
      if (onStart) {
        onStart(subscribeOptions);
      }
      connection.subscribe(subscribeOptions);
    },

    stop() {
      if (onStop) {
        onStop(subscribeOptions);
      }
      connection.unsubscribe(subscriptionId);
    }
  });

  if (transform) {
    return transform(observable, opts);
  }

  return observable;

  function onData(data: OUT) {
    if (onDataSideEffect) {
      onDataSideEffect(subscribeOptions, data);
    }
    observable.emit(data);
  }
}

function defaultGetData<IN>(subscriptionId: number, params: IN): Object {
  return {
    subscriptionId,
    ...params
  };
}
