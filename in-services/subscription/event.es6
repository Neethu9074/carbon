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

function getId(eventId) {
  return eventId;
}

function createEventObservable(eventId) {
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
        'eventId': eventId
      });

      if (eventId === 'issue_1') {
        onData(Immutable.fromJS({
          id: 'issue_1',
          problem: {
            id: 'problem_1',
            severity: 5,
            snapshotId: '1',
            problemText: 'this is an issue',
            fixSuggestion: 'fix it hard!'
          },
          start: Date.now() - 50000,
          referencedEvents: ['incident_1'],
          type: 'issue'
        }));
      } else if (eventId === 'change_1') {
        onData(Immutable.fromJS({
          id: 'change_1',
          problem: {
            id: 'problem_2',
            severity: 0,
            snapshotId: '1',
            problemText: 'this is a change',
            fixSuggestion: 'shit happens'
          },
          start: Date.now() - 200000,
          referencedEvents: ['incident_1'],
          type: 'change'
        }));
      } else {
        onData(Immutable.fromJS({
          id: 'incident_1',
          referencedEvents: [
            'issue_1',
            'change_1'
          ],
          start: Date.now() - 1000,
          type: 'incident'
        }));
      }
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
