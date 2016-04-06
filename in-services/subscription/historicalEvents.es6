import {create} from 'reactive-observables';
import Immutable from 'immutable';

import {getNewSubscriptionId, subscribe, unsubscribe} from 'in-services/subscription/subscriptionManager';
import createObservableIfMissing from 'in-services/subscription/subscriptionObservablesCache';
import {getDataEvent} from 'in-services/subscription/dataEvent';
import {on, off} from 'in-services/persistentConnection';

export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createEventObservable
});

function getId(timeframe) {
  return timeframe.to + ',' + timeframe.windowSize;
}

function createEventObservable(timeframe) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'subscribe-events', {
        'subscriptionId': subscriptionId,
        'timeframe': timeframe
      });

      onData(Immutable.fromJS([]));
    },

    stop() {
      off(dataEvent, onData);
      unsubscribe(subscriptionId);
    }
  });

  return observable;

  function onData(events) {
    observable.emit(Immutable.fromJS(events));
  }
}
