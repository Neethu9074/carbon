import WaitForServerInitialized from 'in-services/subscription/manager/states/WaitForServerInitialized';
import ConnectionLostState from 'in-services/subscription/manager/states/ConnectionLostState';
import BackendReadyState from 'in-services/subscription/manager/states/BackendReadyState';
import WindowHiddenState from 'in-services/subscription/manager/states/WindowHiddenState';
import InitState from 'in-services/subscription/manager/states/InitState';
import { createFsm } from 'in-services/fsm';

const sharedState = {
  // {
  //   <id>: {
  //     subscriptionId
  //     event: 'event to send to establish subscription'
  //     payload: 'payload to be send to establish subscription'
  //     lastData: 'last retrieved data point',
  //     dataListener: 'function used to read data from socket'
  //   }
  // }
  activeSubscriptions: new Map(),

  // How long it takes until the subscriptions are disposed backend wise when the
  // browser tab is no longer visible.
  timeUntilDisposingSubscriptionsForHiddenUi: 1000 * 60
};

export default createFsm({
  publicInterface: ['subscribe', 'init'],

  initialState: 'init',

  states: {
    waitForServerInitialized: new WaitForServerInitialized(sharedState),
    init: new InitState(sharedState),
    windowHidden: new WindowHiddenState(sharedState),
    backendReady: new BackendReadyState(sharedState),
    connectionLost: new ConnectionLostState(sharedState)
  }
});
