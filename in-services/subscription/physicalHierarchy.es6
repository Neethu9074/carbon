import {create} from 'reactive-observables';
import Immutable from 'immutable';

import {on, off} from '../persistentConnection';
import {
  getNewSubscriptionId,
  subscribe,
  unsubscribe
} from './subscriptionManager';
import createObservableIfMissing from './subscriptionObservablesCache';

export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createPhysicalHierarchyObservable
});

function getId({snapshotId}) {
  return snapshotId;
}

function createPhysicalHierarchyObservable({snapshotId}) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = 'data-' + subscriptionId;

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'subscribe-physical-hierarchy', {
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

  function onData(hierarchy) {
    observable.emit(Immutable.fromJS(hierarchy));
  }
}
