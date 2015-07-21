'use strict';

import React from 'react';
import {cursorPosition} from '../../stores/mapStore';

import './Tooltip.less';


export default class Tooltip {
  constructor(parent) {
    this.parent = parent;

    this.stickyNoteContainer = document.createElement('div');
    this.stickyNoteContainer.classList.add('in-tooltip');

    this.style = this.stickyNoteContainer.style;
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

  mount() {
    this.parent.getHtmlContainer().appendChild(this.stickyNoteContainer);

    this.moveSubscribtion = cursorPosition.subscribe((xy) =>
      this.setScreenPosition(xy));

    this.render();
  }

  unMount() {
    this.moveSubscribtion.dispose();
    this.moveSubscribtion = null;

    React.unmountComponentAtNode(this.stickyNoteContainer);
    const container = this.stickyNoteContainer;
    container.parentNode.removeChild(container);
  }
}
