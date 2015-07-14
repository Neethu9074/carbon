'use strict';

import React from 'react';
import {cursorPositionStore} from '../../stores/cursorPositionStore';

import './Tooltip.less';


export default class Tooltip {
  constructor(parent) {
    this.parent = parent;

    this.stickyNoteContainer = document.createElement('div');
    this.stickyNoteContainer.classList.add('in-tooltip');
    parent.getHtmlContainer().appendChild(this.stickyNoteContainer);

    this.style = this.stickyNoteContainer.style;

    this.moveSubscribtion = cursorPositionStore.subscribe((xy) =>
      this.setScreenPosition(xy));
  }

  setScreenPosition(xy) {
    const x = xy.x;
    const y = xy.y;
    const translate = `translate3d(${x}px,${y}px,0)`;

    const style = this.style;
    style.transform = translate;
    style['-webkit-transform'] = translate;

    //set to '' because the display is set by zoom too. If you would set
    //this value to another like '' you would overrite it
    style.display = '';
  }

  dispose() {
    this.moveSubscribtion.dispose();
    this.moveSubscribtion = null;

    const container = this.stickyNoteContainer;
    React.unmountComponentAtNode(container);
    container.parentNode.removeChild(container);
  }
}
