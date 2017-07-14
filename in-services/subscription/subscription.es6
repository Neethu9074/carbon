import { create } from 'reactive-observables';

import memoize from 'in-services/util/memoizingObservableGenerator';
import { connection } from 'in-services/connection';

let loadTestEnabled = false;
export function setLoadTestEnabled(enabled = false) {
  loadTestEnabled = enabled;
}

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
  if (loadTestEnabled) {
    event += '-load-test';
  }

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
    observable.emit(transformData(data));
  }
}

function identity(e) {
  return e;
}
