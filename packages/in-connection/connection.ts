/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import EventEmitter from 'eventemitter3';
import { get } from 'lodash';

import { SharedState, SubscriptionDebuggingData, SubscriptionDescription } from 'in-connection/types';
import WindowHiddenLongTimeState from 'in-connection/states/WindowHiddenLongTimeState';
import ConnectionLostState from 'in-connection/states/ConnectionLostState';
import WindowHiddenState from 'in-connection/states/WindowHiddenState';
import WaitForInitState from 'in-connection/states/WaitForInitState';
import ConnectedState from 'in-connection/states/ConnectedState';
import { compare } from 'in-services/util/string';
import { createFsm } from 'in-connection/fsm';
import { seconds } from 'in-services/time';

window.instana.dev = window.instana.dev || {};
const sharedState: SharedState = (window.instana.dev.ws = {
  socket: undefined,
  events: new EventEmitter(),

  // We want to reduce the overhead of channels on the network. Example: A metric
  // subscription would need to include the hostId, plugin, steadyId, metric
  // name and possibly other pieces of information in order to route messages.
  // This is way too much overhead. We want to route messages based on a single
  // numeric value. This is what these IDs are for. We include a single ID in
  // server responses to reduce the overhead.
  subscriptionIdCounter: 0,

  metrics: {
    received: 0,
    transmitted: 0,
    connectionAttempts: 0
  },

  // {
  //   <id>: {
  //     subscriptionId
  //     event: 'event to send to establish subscription'
  //     payload: 'payload to be send to establish subscription'
  //     isSubscribedToBackend: true|false
  //     disposeSubscriptionOnDocumentHidden: true|false
  //     listener,
  //     initializationCallStack: ?Error
  //   }
  // }
  subscriptions: new Map(),

  // How long it takes until the subscriptions are disposed backend wise when the
  // browser tab is no longer visible.
  timeUntilDisposingSubscriptionsForHiddenUi: seconds.toMillis(30)
});

export const connection = createFsm({
  initialState: 'waitForInit',

  states: {
    waitForInit: new WaitForInitState(sharedState),
    connectionLost: new ConnectionLostState(sharedState),
    connected: new ConnectedState(sharedState),
    windowHiddenLongTime: new WindowHiddenLongTimeState(sharedState),
    windowHidden: new WindowHiddenState(sharedState)
  }
});

export function init() {
  connection.init();
}

export function getDebuggingData() {
  const subscriptions: SubscriptionDebuggingData[] = [];
  const counts: Record<string, number> = {};

  sharedState.subscriptions.forEach(subscriptionDescription => {
    const event = subscriptionDescription.event;
    counts[event] = (counts[event] || 0) + 1;
    subscriptions.push({
      event: event,
      payload: subscriptionDescription.payload,
      subscribed: subscriptionDescription.isSubscribedToBackend
    });
  });

  subscriptions.sort((a, b) => compare(a.event, b.event));

  return {
    subscriptions,
    perSubscriptionCounts: counts,
    transport: {
      metrics: {
        ...sharedState.metrics,
        maxSubscriptionId: sharedState.subscriptionIdCounter
      },
      type: get(sharedState, ['socket', 'transport']),
      url: get(sharedState, ['socket', '_transport', 'url'])
    }
  };
}

export function getInitializationCallStack(subscriptionId: number) {
  const subscription = sharedState.subscriptions.get(subscriptionId);
  return subscription ? subscription.initializationCallStack : null;
}

export function getSubscriptionPayload(subscriptionId: number) {
  const subscription = sharedState.subscriptions.get(subscriptionId);
  return subscription ? subscription.payload : null;
}

/**
 * Disconnects the current socket connection if it exists
 * @private
 * @returns {boolean} True if there was an active connection that could be disconnected
 */
function disconnect(): boolean {
  if (sharedState.socket && sharedState.socket.readyState === WebSocket.OPEN) {
    sharedState.socket.close();
    sharedState.socket = undefined;
    return true;
  }

  return false;
}

/**
 * Disconnects the current socket connection and reinitializes it.
 * @private
 * @returns {Map<number, SubscriptionDescription<T>>} A copy of the existing subscriptions before reconnecting
 */
function reconnect<T>(): Map<number, SubscriptionDescription<T>> {
  // Store existing subscriptions before reconnecting
  const existingSubscriptions = new Map(sharedState.subscriptions);

  disconnect();

  // Re-initialize the connection
  connection.init();

  return existingSubscriptions;
}

/**
 * Re-subscribes to all previously active subscriptions.
 * @private
 * @param {Map<number, SubscriptionDescription<T>>} subscriptions - The subscriptions to restore
 */
function resubscribe<T>(subscriptions: Map<number, SubscriptionDescription<T>>) {
  subscriptions.forEach((subscription, subscriptionId) => {
    if (subscription.isSubscribedToBackend) {
      connection.subscribe<T>({
        subscriptionId,
        event: subscription.event,
        payload: subscription.payload,
        disposeSubscriptionOnDocumentHidden: subscription.disposeSubscriptionOnDocumentHidden,
        listener: subscription.listener,
        initializationCallStack: subscription.initializationCallStack
      });
    }
  });
}

/**
 * Refreshes all connections and subscriptions.
 * This is useful when changing team focus (and apply new permissions) without
 * reloading the page, or in any other scenario where connections need to be
 * refreshed.
 */
export function refreshConnection() {
  const existingSubscriptions = reconnect();
  resubscribe(existingSubscriptions);
}
