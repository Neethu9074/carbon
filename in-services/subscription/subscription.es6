import { create } from 'reactive-observables';

import memoize from 'in-services/util/memoizingObservableGenerator';
import { connection } from 'in-services/connection';

let loadTestEnabled = false;
export function setLoadTestEnabled(enabled = false) {
  loadTestEnabled = enabled;
  return loadTestEnabled;
}

export default function({
  eventId,
  getId,
  getData,
  transformData = identity,
  memoizeFor = 10000,
  disposeSubscriptionOnDocumentHidden = true,
  getScanner = null
}) {
  return memoize(
    createObservable.bind(null, eventId, getData, transformData, disposeSubscriptionOnDocumentHidden, getScanner),
    getId,
    memoizeFor
  );
}

function createObservable(event, getData, transformData, disposeSubscriptionOnDocumentHidden, getScanner, opts) {
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
