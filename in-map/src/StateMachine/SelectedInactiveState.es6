import AState from './AState';


export default class SelectedInactiveState extends AState {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.onSelectedInactiveEnter();
  }

  leave() {
    this.owner.onSelectedInactiveLeave();
  }
}
