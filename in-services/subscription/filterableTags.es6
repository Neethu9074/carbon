import {create} from 'reactive-observables';
import Immutable from 'immutable';

import {getNewSubscriptionId, subscribe, unsubscribe} from './subscriptionManager';
import createObservableIfMissing from './subscriptionObservablesCache';
import {on, off} from '../persistentConnection';


export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createFilterableTagsObservable
});

function getId() {
  return '';
}

function createFilterableTagsObservable() {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = 'data-' + subscriptionId;

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'subscribe-filterable-tags', {
        'subscriptionId': subscriptionId
      });
    },

    stop() {
      off(dataEvent, onData);
      unsubscribe(subscriptionId);
    }
  });

  return observable;

  function onData(filterableTags) {
    filterableTags.sort();
    observable.emit(Immutable.List(filterableTags));
  }
}
