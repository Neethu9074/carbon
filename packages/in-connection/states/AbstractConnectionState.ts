/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createLogger } from '@instana/logger';

import { Connection, SharedState, SubscriptionDescription, Listener, SubscribeOptions } from 'in-connection/types';
import AbstractFsmState from 'in-connection/states/AbstractFsmState';

const logger = createLogger('connection/states/AbstractConnectionState');

export default class AbstractConnectionState extends AbstractFsmState implements Connection {
  readonly sharedState: SharedState;

  constructor(sharedState: SharedState) {
    super();
    this.sharedState = sharedState;
  }

  on<T>(event: string, fn: Listener<T>) {
    this.sharedState.events.on(event, fn);
  }

  off<T>(event: string, fn: Listener<T>) {
    this.sharedState.events.off(event, fn);
  }

  init() {
    logger.debug(`init() not supported in state: ${this.getActiveState()}`);
  }

  subscribe<T>(options: SubscribeOptions<T>) {
    const {
      subscriptionId,
      event,
      payload,
      disposeSubscriptionOnDocumentHidden,
      listener,
      initializationCallStack
    } = options;

    // backend is expecting subscription IDs to be part of the payload.
    // TODO can/should we avoid this?
    payload.subscriptionId = subscriptionId;

    const subscriptionDescription: SubscriptionDescription<T> = {
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

  sendSubscribeWhenNecessary<T>(subscriptionDescription: SubscriptionDescription<T>) {
    if (!subscriptionDescription.isSubscribedToBackend) {
      subscriptionDescription.isSubscribedToBackend = true;
      this.send(subscriptionDescription.event, subscriptionDescription.payload);
    }
  }

  unsubscribe(subscriptionId: number) {
    const subscriptionDescription = this.sharedState.subscriptions.get(subscriptionId);
    if (!subscriptionDescription) {
      return;
    }

    this.sharedState.subscriptions.delete(subscriptionId);
    this.off(`d${subscriptionId}`, subscriptionDescription.listener);
    this.sendUnsubscribeWhenNecessary(subscriptionDescription);
  }

  sendUnsubscribeWhenNecessary<T>(subscriptionDescription: SubscriptionDescription<T>) {
    if (subscriptionDescription.isSubscribedToBackend) {
      this.send('unsubscribe', { subscriptionId: subscriptionDescription.subscriptionId });
      subscriptionDescription.isSubscribedToBackend = false;
    }
  }

  getNewSubscriptionId() {
    return this.sharedState.subscriptionIdCounter++;
  }

  send(event: string, obj: any) {
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
