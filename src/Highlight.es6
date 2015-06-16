'use strict';

export default class Highlight {

  constructor({client}) {
    //the object using this highlighter
    this.client = client;

    //flag for the primary highlighting
    this.isHighlighted = false;

    //a counter for Indirect highlighting. it count #objects penetrating the
    //client for Indirect highlighting
    this.IndirectHighlightCounter = 0;
  }

  //sets the primary highlight whatever that means
  setHighlight() {
    this.isHighlighted = true;
  }

  //clears the primary highlighting
  clearHighlight() {
    this.isHighlighted = false;
  }

  setIndirectHighlight() {
    this.IndirectHighlightCounter++;
  }

  clearIndirectHighlight() {
    this.IndirectHighlightCounter--;

    //other nodes/connections/whatever keep that client highlighting
    if(this.IndirectHighlightCounter > 0) {
      return;
    }

    this.disposeIndirectHighlight();

    //avoing negative counting
    this.IndirectHighlightCounter = 0;
  }

  //disposing the indirect highlighting if the counter is 0
  disposeIndirectHighlight() {throw new Error('NOT IMPLEMENTED'); }

  dispose() {
    this.clearHighlight();
    this.disposeIndirectHighlight();

    this.client = null;
    this.isHighlighted = null;
    this.IndirectHighlightCounter = null;
  }
}
