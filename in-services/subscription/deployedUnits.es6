import {create} from 'reactive-observables';
import Immutable from 'immutable';

import {getDataEvent} from 'in-services/subscription/dataEvent';
import {getNewSubscriptionId, subscribe, unsubscribe} from 'in-services/subscription/subscriptionManager';
import createObservableIfMissing from 'in-services/subscription/subscriptionObservablesCache';
import {on, off} from 'in-services/persistentConnection';


export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createDeployedUnitsObservable
});

function getId(snapshotId) {
  return snapshotId;
}

function createDeployedUnitsObservable(snapshotId) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'subscribe-deployed-units', {
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

  function onData(units) {
    observable.emit(Immutable.Set(units));
  }
}
