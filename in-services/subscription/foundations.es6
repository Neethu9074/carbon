import {create} from 'reactive-observables';
import Immutable from 'immutable';

import {getDataEvent} from 'in-services/subscription/dataEvent';
import {getNewSubscriptionId, subscribe, unsubscribe} from 'in-services/subscription/subscriptionManager';
import createObservableIfMissing from 'in-services/subscription/subscriptionObservablesCache';
import {on, off} from 'in-services/persistentConnection';

export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createFoundationObservable
});

function getId(snapshotId) {
  return snapshotId;
}

function createFoundationObservable(snapshotId) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'subscribe-foundations', {
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

  function onData(foundations) {
    observable.emit(Immutable.fromJS(foundations));
  }
}
