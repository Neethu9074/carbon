import {create} from 'reactive-observables';
import Immutable from 'immutable';
import invariant from 'invariant';

import throttleNextFrame from 'in-services/util/throttleNextFrame';
import {getNewSubscriptionId, subscribe, unsubscribe} from 'in-services/subscription/subscriptionManager';
import createObservableIfMissing from 'in-services/subscription/subscriptionObservablesCache';
import {getDataEvent} from 'in-services/subscription/dataEvent';
import {on, off} from 'in-services/persistentConnection';

export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createSnapshotObservable
});

function getId(snapshotId) {
  return snapshotId;
}

function createSnapshotObservable(snapshotId) {
  invariant(
    snapshotId,
    'A snapshotId is required in order to retrieve snapshots.'
  );
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  const observable = create({
    start() {
      on(dataEvent, throttleNextFrame(onData));
      subscribe(subscriptionId, 'subscribe-snapshot', {
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

  function onData(snapshot) {
    observable.emit(Immutable.fromJS(snapshot));
  }
}
