import {create} from 'reactive-observables';

import {on, off} from '../persistentConnection';
import {
  getNewSubscriptionId,
  subscribe,
  unsubscribe
} from './subscriptionManager';
import createObservableIfMissing from './subscriptionObservablesCache';

export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createLiveMetricObservable
});

function getId({snapshotId, metric, timeframe}) {
  return snapshotId + metric + timeframe;
}

function createLiveMetricObservable({snapshotId, metric, timeframe}) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = 'data-' + subscriptionId;

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'subscribe-live-metric', {
        'subscriptionId': subscriptionId,
        'snapshotId': snapshotId,
        'metric': metric,
        'timeframe': timeframe
      });
    },

    stop() {
      off(dataEvent, onData);
      unsubscribe(subscriptionId);
    }
  });

  return observable;

  function onData(update) {
    // Mutable on purpose – for performance reasons.
    observable.emit({
      timestamp: update[0],
      value: update[1]
    });
  }
}
