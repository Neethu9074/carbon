import AbstractState from 'in-services/connection/states/AbstractState';

export default class WaitForInitState extends AbstractState {
  init() {
    this.transitionTo('connectionLost');
  }
}
