import AState from '../../../StateMachine/AState';


export default class HiddenState extends AState {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.onHiddenEnter();
  }

  leave() {
    this.owner.onHiddenLeave();
  }
}
