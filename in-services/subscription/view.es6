import {create} from 'reactive-observables';
import Immutable from 'immutable';

import {on, off} from '../persistentConnection';
import {
  getNewSubscriptionId,
  subscribe,
  unsubscribe
} from '../subscriptionManager';
import createObservableIfMissing from './subscriptionObservablesCache';

export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createViewObservable
});

function getId({type}) {
  return type;
}

function createViewObservable({viewType}) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = 'data-' + subscriptionId;

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe('subscribe-view', {
        'subscriptionId': subscriptionId,
        'viewType': viewType
      });
    },

    stop() {
      off(dataEvent, onData);
      unsubscribe(subscriptionId);
    }
  });

  return observable;

  function onData(viewStructure) {
    observable.emit(Immutable.fromJS(viewStructure));
  }
}
