

import State from './State';

export default class HiddenState extends State {

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
