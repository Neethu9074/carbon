import { createLogger } from 'instalog';

import { AbstractState } from 'in-services/fsm';

const logger = createLogger('connection/states/AbstractState');

export default class AbstractConnectionState extends AbstractState {
  constructor(sharedState) {
    super();
    this.sharedState = sharedState;
  }

  on(event, fn) {
    this.sharedState.events.on(event, fn);
  }

  off(event, fn) {
    this.sharedState.events.off(event, fn);
  }

  init() {
    logger.debug(`init() not supported in state: ${this.getActiveState()}`);
  }

  subscribe({ subscriptionId, event, payload, disposeSubscriptionOnDocumentHidden, listener }) {
    payload.subscriptionId = subscriptionId;
    const subscriptionDescription = {
      subscriptionId,
      event,
      payload,
      disposeSubscriptionOnDocumentHidden,
      isSubscribedToBackend: false,
      listener
    };

    this.sharedState.subscriptions.set(subscriptionId, subscriptionDescription);
    this.on(`d${subscriptionId}`, listener);
    this.sendSubscribeWhenNecessary(subscriptionDescription);
  }

  sendSubscribeWhenNecessary(subscriptionDescription) {
    if (!subscriptionDescription.isSubscribedToBackend) {
      this.send(subscriptionDescription.event, subscriptionDescription.payload);
      subscriptionDescription.isSubscribedToBackend = true;
    }
  }

  unsubscribe(subscriptionId) {
    const subscriptionDescription = this.sharedState.subscriptions.get(subscriptionId);
    if (!subscriptionDescription) {
      return;
    }

    this.sharedState.subscriptions.delete(subscriptionId);
    this.off(`d${subscriptionId}`, subscriptionDescription.listener);
    this.sendUnsubscribeWhenNecessary(subscriptionDescription);
  }

  sendUnsubscribeWhenNecessary(subscriptionDescription) {
    if (subscriptionDescription.isSubscribedToBackend) {
      this.send('unsubscribe', { subscriptionId: subscriptionDescription.subscriptionId });
      subscriptionDescription.isSubscribedToBackend = false;
    }
  }

  getNewSubscriptionId() {
    return this.sharedState.subscriptionIdCounter++;
  }

  send(event, obj) {
    this.sharedState.metrics.transmitted++;
    this.sharedState.socket.send(`${event},${JSON.stringify(obj)}`);
  }
}
