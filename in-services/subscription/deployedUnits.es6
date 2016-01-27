import {create} from 'reactive-observables';
import Immutable from 'immutable';

import {getNewSubscriptionId, subscribe, unsubscribe} from './subscriptionManager';
import createObservableIfMissing from './subscriptionObservablesCache';
import {on, off} from '../persistentConnection';


export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createDeployedUnitsObservable
});

function getId(snapshotId) {
  return snapshotId;
}

function createDeployedUnitsObservable(snapshotId) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = 'data-' + subscriptionId;

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
