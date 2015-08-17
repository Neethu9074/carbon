import AState from '../../../StateMachine/AState';


export default class SelectedState extends AState {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.onSelectedEnter();
  }

  leave() {
    this.owner.onSelectedLeave();
  }
}
