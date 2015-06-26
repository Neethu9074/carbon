'use strict';

import State from '../../../../State';

export default class HighlightedState extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.setHighlight();
  }

  leave() {
    this.owner.clearHighlight();
  }

  getNext({highlighted, onClick, inactive}) {
    if(onClick) {
      return this.owner.states.selected;
    } else if(inactive) {
      return this.owner.states.inactive;
    } else if(highlighted === false) {
      return this.owner.states.initial;
    }
    return undefined;
  }
}
