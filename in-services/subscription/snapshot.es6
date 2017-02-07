import {create} from 'reactive-observables';
import {fromJS} from 'immutable';
import invariant from 'invariant';

import {getNewSubscriptionId, subscribe, unsubscribe} from 'in-services/subscription/subscriptionManager';
import memoize from 'in-services/util/memoizingObservableGenerator';
import throttleNextFrame from 'in-services/util/throttleNextFrame';
import {getDataEvent} from 'in-services/subscription/dataEvent';
import {on, off} from 'in-services/persistentConnection';

export default memoize(createSnapshotObservable, getId);

function getId({snapshotId, time}) {
  return snapshotId + time;
}

function createSnapshotObservable({snapshotId, time}) {
  if (__DEV__) {
    invariant(
      typeof(snapshotId) === 'string',
      'A snapshotId (string) is required in order to retrieve snapshots. Got: \n' + JSON.stringify(snapshotId, 0, 2)
    );
  }
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  const observable = create({
    start() {
      on(dataEvent, throttleNextFrame(onData));
      subscribe(subscriptionId, 'subscribe-snapshot', {
        'subscriptionId': subscriptionId,
        'snapshotId': snapshotId,
        'time': time
      });
    },

    stop() {
      off(dataEvent, onData);
      unsubscribe(subscriptionId);
    }
  });

  return observable;

  function onData(snapshot) {
    observable.emit(fromJS(snapshot));
  }
}
