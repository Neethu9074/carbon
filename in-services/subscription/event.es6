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

function getId({eventId, to}) {
  return eventId + ',' + to;
}

function createEventObservable({eventId, to}) {
  invariant(
    eventId,
    'A eventId is required in order to retrieve event.'
  );
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);
  const observable = create({
    start() {
      on(dataEvent, throttleNextFrame(onData));
      subscribe(subscriptionId, 'subscribe-event', {
        'subscriptionId': subscriptionId,
        'eventId': eventId,
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
    observable.emit(Immutable.fromJS(event));
  }
}
