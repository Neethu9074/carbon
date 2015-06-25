'use strict';

import State from '../../../../State';


export default class SelectedState extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.setHighlight();
    this.owner.selectNode();
  }

  leave() {
    this.owner.clearHighlight();
    this.owner.clearNode();
  }

  getNext({highlighted, onClick}) {
    if(onClick) {
      if(highlighted) {
        return this.owner.states.highlighted;
      } else {
        return this.owner.states.initial;
      }
    }
    return undefined;
  }
}
