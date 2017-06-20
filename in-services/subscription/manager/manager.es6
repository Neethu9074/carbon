import ConnectionLostState from 'in-services/subscription/manager/states/ConnectionLostState';
import BackendReadyState from 'in-services/subscription/manager/states/BackendReadyState';
import WindowHiddenState from 'in-services/subscription/manager/states/WindowHiddenState';
import WaitForInit from 'in-services/subscription/manager/states/WaitForInit';
import InitState from 'in-services/subscription/manager/states/InitState';
import { createFsm } from 'in-services/fsm';

export default createFsm({
  publicInterface: ['subscribe', 'init'],

  initialState: 'waitForInit',

  states: {
    waitForInit: new WaitForInit(),
    init: new InitState(),
    windowHidden: new WindowHiddenState(),
    backendRedy: new BackendReadyState(),
    connectionLost: new ConnectionLostState()
  }
});
