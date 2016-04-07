import {create} from 'reactive-observables';
import Immutable from 'immutable';
import invariant from 'invariant';

import {getNewSubscriptionId, subscribe, unsubscribe} from 'in-services/subscription/subscriptionManager';
import createObservableIfMissing from 'in-services/subscription/subscriptionObservablesCache';
import throttleNextFrame from 'in-services/util/throttleNextFrame';
import {getDataEvent} from 'in-services/subscription/dataEvent';
import {on, off} from 'in-services/persistentConnection';

export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createEventObservable
});

function getId({eventIds, from, to}) {
  return eventIds.map(id => id + ',') + from + to;
}

function createEventObservable({eventIds, to, from}) {
  invariant(
    eventIds && from,
    'eventIds and a from-timestamp are required in order to retrieve events within a timeframe.'
  );
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  console.log('subscribe to:', eventIds, from, to);
  const observable = create({
    start() {
      on(dataEvent, throttleNextFrame(onData));
      subscribe(subscriptionId, 'subscribe-events-within-timerange', {
        'subscriptionId': subscriptionId,
        'eventIds': eventIds,
        'from': from,
        'to': to
      });
    },

    stop() {
      off(dataEvent, onData);
      unsubscribe(subscriptionId);
    }
  });

  return observable;

  function onData(event) {
    console.log('got data:', event);
    observable.emit(Immutable.fromJS(event));
  }
}
