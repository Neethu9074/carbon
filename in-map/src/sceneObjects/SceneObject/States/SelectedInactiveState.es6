

import State from './State';


export default class SelectedInactiveState extends State {

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
