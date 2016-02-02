import {create} from 'reactive-observables';

import {getDataEvent} from 'in-services/subscription/dataEvent';
import {getNewSubscriptionId, subscribe, unsubscribe} from 'in-services/subscription/subscriptionManager';
import createObservableIfMissing from 'in-services/subscription/subscriptionObservablesCache';
import {on, off} from 'in-services/persistentConnection';

export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createLiveMetricObservable
});

function getId({snapshotId, metric, timeframe}) {
  return snapshotId + metric + timeframe;
}

function createLiveMetricObservable({snapshotId, metric, timeframe}) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'subscribe-historic-metric', {
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
    observable.emit(update.map(metricUpdate => {
      return {
        timestamp: metricUpdate[0],
        value: metricUpdate[1]
      };
    }));
  }
}
