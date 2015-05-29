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

  updateWorldPos() {}

  update() {
    this.updateWorldPos();

    const scene = this.parent.getScene();
    const pos = this.stickyNoteEndPosWorld.clone();
    pos.applyMatrix4(scene.camera.projection);

    const x = ((pos.x + 1) * scene.width / 2) | 0;
    const y = ((-pos.y + 1) * scene.height / 2) | 0;
    const translate = `translate3d(${x}px,${y}px,0)`;

    const stickyNoteContainerStyle = this.style;
    stickyNoteContainerStyle.transform = translate;
    stickyNoteContainerStyle['-webkit-transform'] = translate;

    //set to '' because the display is set by zoom too. If you would set
    //this value to another like '' you would overwrite it
    stickyNoteContainerStyle.display = '';
  }

  render() {}

  dispose() {
    const container = this.stickyNoteContainer;

    React.unmountComponentAtNode(container);
    container.parentNode.removeChild(container);
  }
}
