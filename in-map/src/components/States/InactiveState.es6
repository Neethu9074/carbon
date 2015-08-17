import AState from '../../StateMachine/AState';

export default class InactiveState extends AState {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.onInactiveEnter();
  }

  leave() {
    this.owner.onInactiveLeave();
  }
}
