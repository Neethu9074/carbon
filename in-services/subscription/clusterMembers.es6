import {create} from 'reactive-observables';
import Immutable from 'immutable';

import {getNewSubscriptionId, subscribe, unsubscribe} from 'in-services/subscription/subscriptionManager';
import createObservableIfMissing from 'in-services/subscription/subscriptionObservablesCache';
import {getDataEvent} from 'in-services/subscription/dataEvent';
import {on, off} from 'in-services/persistentConnection';


export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createClusterMembersObservable
});

function getId(snapshotId) {
  return snapshotId;
}

function createClusterMembersObservable(snapshotId) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'subscribe-cluster-members', {
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

  function onData(clusterMembers) {
    observable.emit(Immutable.Set(clusterMembers));
  }
}
