import AState from '../../../StateMachine/AState';


export default class InitialState extends AState {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.onInitialEnter();
  }

  leave() {
    this.owner.onInitialLeave();
  }
}
