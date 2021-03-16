/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createLogger } from '@instana/logger';

import { AbstractState } from 'in-connection/fsm';

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

  subscribe({
    subscriptionId,
    event,
    payload,
    disposeSubscriptionOnDocumentHidden,
    listener,
    initializationCallStack
  }) {
    payload.subscriptionId = subscriptionId;
    const subscriptionDescription = {
      subscriptionId,
      event,
      payload,
      disposeSubscriptionOnDocumentHidden,
      isSubscribedToBackend: false,
      listener,
      initializationCallStack
    };

    this.sharedState.subscriptions.set(subscriptionId, subscriptionDescription);
    this.on(`d${subscriptionId}`, listener);
    this.sendSubscribeWhenNecessary(subscriptionDescription);
  }

  sendSubscribeWhenNecessary(subscriptionDescription) {
    if (!subscriptionDescription.isSubscribedToBackend) {
      subscriptionDescription.isSubscribedToBackend = true;
      this.send(subscriptionDescription.event, subscriptionDescription.payload);
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
    try {
      if (this.sharedState.socket) {
        this.sharedState.metrics.transmitted++;
        this.sharedState.socket.send(`${event},${JSON.stringify(obj)}`);
      } else {
        logger.info(
          'Not transmitting event to backend because connection is not currently established. Event Name:',
          event
        );
      }
    } catch (e) {
      logger.error('Failed to transmit WebSocket message', event, e);
    }
  }
}
