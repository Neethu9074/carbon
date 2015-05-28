'use strict';

import THREE from 'three';
import React from 'react';


export default class StickyNote {
  constructor({parent, cssClass}) {
    this.parent = parent;

    this.stickyNoteContainer = document.createElement('div');
    this.stickyNoteContainer.classList.add(cssClass);
    parent.getHtmlContainer().appendChild(this.stickyNoteContainer);
    this.style = this.stickyNoteContainer.style;
    this.stickyNoteEndPosWorld = new THREE.Vector3();
  }

  hide() {
    if(this.style.display !== 'none') {
      this.style.display = 'none';
    }
  }

  update() {}

  render() {}

  dispose() {
    const container = this.stickyNoteContainer;

    React.unmountComponentAtNode(container);
    container.parentNode.removeChild(container);
  }
}
