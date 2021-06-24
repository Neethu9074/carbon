/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

import memoize from 'in-services/util/memoizingObservableGenerator';
import { generateStableHash } from '@instana/utils';
import { connection } from 'in-connection';

/**
 * Returns a function (Param => Observable<Result>) that, when called, yields an observable of Result values.
 *
 * Type params:
 * - PARAM: the type of object this subscription needs for getId and getData
 * - RESULT: the type of values the new subscription will emit
 */
export default function({
  eventId,
  getId = generateStableHash,
  getData = defaultGetData,
  memoizeFor,
  disposeSubscriptionOnDocumentHidden = true,
  transform,
  onStart,
  onStop,
  onData
}) {
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

function createObservable(
  event,
  getData,
  disposeSubscriptionOnDocumentHidden,
  transform,
  onStart,
  onStop,
  onDataSideEffect,
  opts
) {
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

  return observable;

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
