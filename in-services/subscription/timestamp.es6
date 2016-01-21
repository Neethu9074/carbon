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
  createObservable: createTimestampObservable
});

function getId({originate}) {
  return originate;
}

function createTimestampObservable({originate}) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = 'data-' + subscriptionId;

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
