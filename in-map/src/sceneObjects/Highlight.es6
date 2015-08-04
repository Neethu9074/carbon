'use strict';

export default class Highlight {

  constructor({client}) {
    //the object using this highlighter
    this.client = client;

    //flag for the primary highlighting
    this.isHighlighted = false;
  }

  //sets the primary highlight whatever that means
  show() {}

  //clears the primary highlighting
  hide() {}
}
