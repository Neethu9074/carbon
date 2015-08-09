

import State from './State';

export default class HighlightedState extends State {

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
