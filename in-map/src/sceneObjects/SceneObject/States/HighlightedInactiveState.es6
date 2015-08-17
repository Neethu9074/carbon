import AState from '../../../StateMachine/AState';


export default class HightlightedInactiveState extends AState {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.onHighlightInactiveEnter();
  }

  leave() {
    this.owner.onHighlightInactiveLeave();
  }
}
