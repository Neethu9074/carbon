import {create} from 'reactive-observables';

import {getDataEvent} from 'in-services/subscription/dataEvent';
import {getNewSubscriptionId, subscribe, unsubscribe} from 'in-services/subscription/subscriptionManager';
import createObservableIfMissing from 'in-services/subscription/subscriptionObservablesCache';
import {on, off} from 'in-services/persistentConnection';

export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createTimestampObservable
});

function getId({originate}) {
  return originate;
}

function createTimestampObservable({originate}) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'timestamp', {
        'subscriptionId': subscriptionId,
        'originate': originate
      });
    },

    stop() {
      off(dataEvent, onData);
      unsubscribe(subscriptionId);
    }
  });

  return observable;

  function onData(reply) {
    observable.emit(reply);
  }
}
