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

function getId() {
  return '';
}

function createEventObservable() {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'subscribe-open-issues', {
        'subscriptionId': subscriptionId
      });

      onData(Immutable.fromJS([{
        id: 'i1',
        problem: {
          id: 'p1',
          severity: 5,
          snapshotId: '1'
        },
        start: Date.now() - 1000,
        type: 'incident'
      }]));
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
