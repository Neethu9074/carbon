import AState from '../../../StateMachine/AState';


export default class SelectedHighlightedInactiveState extends AState {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.onSelectedHighlightInactiveEnter();
  }

  leave() {
    this.owner.onSelectedHighlightInactiveLeave();
  }
}
