import {create} from 'reactive-observables';

import {getNewSubscriptionId, subscribe, unsubscribe} from 'in-services/subscription/subscriptionManager';
import memoize from 'in-services/util/memoizingObservableGenerator';
import {getDataEvent} from 'in-services/subscription/dataEvent';
import {on, off} from 'in-services/persistentConnection';


export default function({eventId, getId, getData, transformData = identity, memoizeFor = 10000}) {
  return memoize(
    createPhysicalHierarchyObservable.bind(null, eventId, getData, transformData),
    getId,
    memoizeFor
  );
}

function createPhysicalHierarchyObservable(eventId, getData, transformData, opts) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, eventId, getData(subscriptionId, opts));
    },

    stop() {
      off(dataEvent, onData);
      unsubscribe(subscriptionId);
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
