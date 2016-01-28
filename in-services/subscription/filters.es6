import {create} from 'reactive-observables';
import Immutable from 'immutable';

import {getNewSubscriptionId, subscribe, unsubscribe} from './subscriptionManager';
import createObservableIfMissing from './subscriptionObservablesCache';
import {on, off} from '../persistentConnection';


export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createFiltersObservable
});

function getId(snapshotId) {
  return snapshotId;
}

function createFiltersObservable() {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = 'data-' + subscriptionId;

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'subscribe-filters', {
        'subscriptionId': subscriptionId
      });
    },

    stop() {
      off(dataEvent, onData);
      unsubscribe(subscriptionId);
    }
  });

  return observable;

  function onData(filters) {
    observable.emit(Immutable.fromJS(filters));
  }
}
