

import State from './State';


export default class SelectedHighlightedInactiveState extends State {

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
