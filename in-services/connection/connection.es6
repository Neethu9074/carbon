import EventEmitter from 'eventemitter3';

import WindowHiddenLongTimeState from 'in-services/connection/states/WindowHiddenLongTimeState';
import ConnectionLostState from 'in-services/connection/states/ConnectionLostState';
import WindowHiddenState from 'in-services/connection/states/WindowHiddenState';
import WaitForInitState from 'in-services/connection/states/WaitForInitState';
import ConnectedState from 'in-services/connection/states/ConnectedState';
import { createFsm } from 'in-services/fsm';

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
    transmitted: 0
  },

  // {
  //   <id>: {
  //     subscriptionId
  //     event: 'event to send to establish subscription'
  //     payload: 'payload to be send to establish subscription'
  //     isSubscribedToBackend: true|false
  //     disposeSubscriptionOnDocumentHidden: true|false
  //     listener
  //   }
  // }
  subscriptions: new Map(),

  // How long it takes until the subscriptions are disposed backend wise when the
  // browser tab is no longer visible.
  timeUntilDisposingSubscriptionsForHiddenUi: 1000 * 30
});

export const connection = createFsm({
  publicApiMethods: ['init', 'subscribe', 'unsubscribe', 'getNewSubscriptionId'],

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
