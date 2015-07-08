'use strict';

import React from 'react';
import eventBus from 'instana-ui-services/eventbus';


export default class Tooltip {
  constructor(parent) {
    this.parent = parent;

    this.stickyNoteContainer = document.createElement('div');
    this.stickyNoteContainer.classList.add('fix');
    parent.getHtmlContainer().appendChild(this.stickyNoteContainer);

    this.style = this.stickyNoteContainer.style;

    this.moveSubscribtion = eventBus.on('onCursorMove').subscribe((xy) =>
      this.setScreenPosition(xy));

    this.setScreenPosition({x: -10000, y: 0});
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
