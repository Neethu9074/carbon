

import State from './State';


export default class HightlightedInactiveState extends State {

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
