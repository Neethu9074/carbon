import { on, off } from 'in-services/persistentConnection';
import { AbstractState } from 'in-services/fsm';

const event = 'server-initialized';
export default class WaitForInitState extends AbstractState {
  onEnter() {
    on(event, this.onInitialized);
  }

  onLeave() {
    off(event, this.onInitialized);
  }

  onInitialized() {
    this.fsm.transitionTo('backendReady');
  }
}
