'use strict';

import THREE from 'three';
import React from 'react';

import './index.less';


export default class StickyNote {
  constructor({parent, cssClass}) {
    this.parent = parent;

    this.stickyNoteContainer = document.createElement('div');
    this.stickyNoteContainer.classList.add(cssClass);
    parent.getHtmlContainer().appendChild(this.stickyNoteContainer);
    this.style = this.stickyNoteContainer.style;

    this.highlighted = false;
  }

  hide() {
    if(this.style.display !== 'none') {
      this.style.display = 'none';
    }
  }

  update() {
    const x = this.parent.screenPosition.x;
    const y = this.parent.screenPosition.y;
    const translate = `translate3d(${x}px,${y}px,0)`;

    const stickyNoteContainerStyle = this.style;
    stickyNoteContainerStyle.transform = translate;
    stickyNoteContainerStyle['-webkit-transform'] = translate;

    //set to '' because the display is set by zoom too. If you would set
    //this value to another like '' you would overrite it
    stickyNoteContainerStyle.display = '';
  }

  setInactive(incactive) {
    const sticky = this.stickyNoteContainer;

    if(incactive) {
      sticky.classList.remove('in-sticky-note__active');
      sticky.classList.add('in-sticky-note__inactive');
    } else {
      sticky.classList.remove('in-sticky-note__inactive');
      sticky.classList.add('in-sticky-note__active');
    }
  }

  onHighlight(highlighted) {
    this.highlighted = highlighted;
    this.render();
  }

  dispose() {
    const container = this.stickyNoteContainer;

    React.unmountComponentAtNode(container);
    container.parentNode.removeChild(container);
  }
}
