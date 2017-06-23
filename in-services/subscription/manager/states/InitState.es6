import { AbstractState } from 'in-services/fsm';

export default class InitState extends AbstractState {
  init() {
    this.fsm.transitionTo('waitForServerInitialized');
  }
}
