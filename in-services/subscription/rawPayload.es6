import {create} from 'reactive-observables';
import Immutable from 'immutable';

import {getDataEvent} from 'in-services/subscription/dataEvent';
import {getNewSubscriptionId, subscribe, unsubscribe} from 'in-services/subscription/subscriptionManager';
import createObservableIfMissing from 'in-services/subscription/subscriptionObservablesCache';
import {on, off} from 'in-services/persistentConnection';

export default createObservableIfMissing.bind(null, {
  getId,
  createObservable: createRawPayloadObservable
});

function getId({snapshotId, payloadName}) {
  return snapshotId + payloadName;
}

function createRawPayloadObservable({snapshotId, payloadName}) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  const observable = create({
    start() {
      on(dataEvent, onData);
      subscribe(subscriptionId, 'subscribe-raw-payload', {
        'subscriptionId': subscriptionId,
        'snapshotId': snapshotId,
        'payloadName': payloadName
      });
    },

    stop() {
      off(dataEvent, onData);
      unsubscribe(subscriptionId);
    }
  });

  return observable;

  function onData(rawPayload) {
    observable.emit(Immutable.fromJS(rawPayload));
  }
}
