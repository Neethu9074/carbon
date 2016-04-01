import Immutable from 'immutable';
import {create} from 'reactive-observables';

import {getNewSubscriptionId, subscribe, unsubscribe} from 'in-services/subscription/subscriptionManager';
import createObservableIfMissing from 'in-services/subscription/subscriptionObservablesCache';
import {getDataEvent} from 'in-services/subscription/dataEvent';
import {on, off} from 'in-services/persistentConnection';

export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createTracesDataObservable
});

function getId(onlyTracesFasterThan) {
  // cache should remain active for one second
  return 'traces' + onlyTracesFasterThan + Math.round(Date.now() / 1000);
}

function createTracesDataObservable(onlyTracesFasterThan) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'subscribe-traces', {
        subscriptionId,
        onlyTracesFasterThan: onlyTracesFasterThan > 0 ? onlyTracesFasterThan : undefined
      });
    },

    stop() {
      off(dataEvent, onData);
      unsubscribe(subscriptionId);
    }
  });

  return observable;

  function onData(traceData) {
    observable.emit(Immutable.fromJS(traceData));
  }
}
