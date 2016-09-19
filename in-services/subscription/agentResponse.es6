import {create} from 'reactive-observables';

import {getNewSubscriptionId} from 'in-services/subscription/subscriptionManager';
import {getDataEvent} from 'in-services/subscription/dataEvent';
import {on, off, emit} from 'in-services/persistentConnection';

/*
 * WARNING:
 * This deliberately does not use the automatic subscription mechanism as the invoked
 * subscription has side effect. We cannot automatically restart these subscriptions.
 */

export default function createAgentResponseObservable({action, target, args}) {
  const subscriptionId = getNewSubscriptionId();
  const dataEvent = getDataEvent(subscriptionId);

  on(dataEvent, onData);
  emit('subscribe-agent-response', {
    subscriptionId,
    target: target.toJS(),
    action,
    args
  });

  const observable = create({
    stop() {
      off(dataEvent, onData);
      emit('unsubscribe', {subscriptionId});
    }
  });

  return observable;

  function onData(data) {
    observable.emit(data);
  }
}
