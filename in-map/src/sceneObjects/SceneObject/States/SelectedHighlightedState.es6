'use strict';

import State from './State';


export default class SelectedHighlightedState extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.onSelectedHighlightEnter();
  }

  leave() {
    this.owner.onSelectedHighlightLeave();
  }
}
