import {create} from 'reactive-observables';

import {getNewSubscriptionId, subscribe, unsubscribe} from 'in-services/subscription/subscriptionManager';
import createObservableIfMissing from 'in-services/subscription/subscriptionObservablesCache';
import {getDataEvent} from 'in-services/subscription/dataEvent';
import {on, off} from 'in-services/persistentConnection';


export default function(eventId, getId, getData, transformData, data) {
  return createObservableIfMissing({
    getId,
    createObservable: createPhysicalHierarchyObservable.bind(null, eventId, getData, transformData, data)
  }, data);
}

function createPhysicalHierarchyObservable(eventId, getData, transformData, snapshotId) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, eventId, getData(subscriptionId, snapshotId));
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
