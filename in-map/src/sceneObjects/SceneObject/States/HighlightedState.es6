import AState from '../../../StateMachine/AState';

export default class HighlightedState extends AState {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.onHighlightEnter();
  }

  leave() {
    this.owner.onHighlightLeave();
  }
}
