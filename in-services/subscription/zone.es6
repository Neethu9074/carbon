import {create} from 'reactive-observables';

import {getNewSubscriptionId, subscribe, unsubscribe} from './subscriptionManager';
import createObservableIfMissing from './subscriptionObservablesCache';
import {on, off} from '../persistentConnection';


export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createZoneObservable
});

function getId(snapshotId) {
  return snapshotId;
}

function createZoneObservable(snapshotId) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = 'data-' + subscriptionId;

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'subscribe-zone', {
        'subscriptionId': subscriptionId,
        'snapshotId': snapshotId
      });
    },

    stop() {
      off(dataEvent, onData);
      unsubscribe(subscriptionId);
    }
  });

  return observable;

  function onData(zoneId) {
    observable.emit(zoneId);
  }
}
