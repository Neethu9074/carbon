import EventEmitter from 'eventemitter3';
import { get } from 'lodash';

import WindowHiddenLongTimeState from 'in-connection/states/WindowHiddenLongTimeState';
import ConnectionLostState from 'in-connection/states/ConnectionLostState';
import WindowHiddenState from 'in-connection/states/WindowHiddenState';
import WaitForInitState from 'in-connection/states/WaitForInitState';
import ConnectedState from 'in-connection/states/ConnectedState';
import { compare } from 'in-services/util/string';
import { createFsm } from 'in-connection/fsm';
import { seconds } from 'in-services/time';

window.instana.dev = window.instana.dev || {};
const sharedState = (window.instana.dev.ws = {
  socket: null,
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
  publicApiMethods: ['init', 'subscribe', 'unsubscribe', 'getNewSubscriptionId', 'on', 'off', 'send'],

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
  const subscriptions = [];
  const counts = {};

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

export function getInitializationCallStack(subscriptionId) {
  const subscription = sharedState.subscriptions.get(subscriptionId);
  return subscription ? subscription.initializationCallStack : null;
}

export function getSubscriptionPayload(subscriptionId) {
  const subscription = sharedState.subscriptions.get(subscriptionId);
  return subscription ? subscription.payload : null;
}
