import {create} from 'reactive-observables';

import {getNewSubscriptionId, subscribe, unsubscribe} from 'in-services/subscription/subscriptionManager';
import createObservableIfMissing from 'in-services/subscription/subscriptionObservablesCache';
import {getDataEvent} from 'in-services/subscription/dataEvent';
import {on, off} from 'in-services/persistentConnection';

export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createHistoricMetricObservable
});

function getId({snapshotId, metric, timeframe, aggregation, rollup}) {
  return snapshotId + metric + timeframe.windowSize + timeframe.to + aggregation + rollup;
}

function createHistoricMetricObservable({snapshotId, metric, timeframe, aggregation, rollup}) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'subscribe-historic-metric', {
        'subscriptionId': subscriptionId,
        'snapshotId': snapshotId,
        'metric': metric,
        'aggregation': aggregation,
        'rollup': rollup,
        'timeframe': timeframe.windowSize
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
    observable.emit(update);
  }
}
