import { create } from 'reactive-observables';

import memoize from 'in-services/util/memoizingObservableGenerator';
import { connection } from 'in-services/connection';

export default function({
  eventId,
  getId,
  getData,
  transformData = identity,
  memoizeFor = 10000,
  disposeSubscriptionOnDocumentHidden = true
}) {
  return memoize(
    createObservable.bind(null, eventId, getData, transformData, disposeSubscriptionOnDocumentHidden),
    getId,
    memoizeFor
  );
}

function createObservable(event, getData, transformData, disposeSubscriptionOnDocumentHidden, opts) {
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

  return observable;

  function onData(data) {
    console.log('Got', event, data);
    observable.emit(transformData(data));
  }
}

function identity(e) {
  return e;
}
