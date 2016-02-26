import React from 'react';

import {applyTransform} from 'in-services/util/dom';


export default class SceneObject {

  constructor({parent, cssClass}) {
    this.cssClass = cssClass;
    this.parent = parent;
  }

  mount() {
    const container = this.container = document.createElement('div');
    container.classList.add(this.cssClass);

    this.parent.getHtmlContainer().appendChild(container);

    // save style for later use
    this.style = container.style;
  }

  unMount() {
    const container = this.container;

    if (container) {
      React.unmountComponentAtNode(container);

      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }
  }

  setScreenPosition({x, y}) {
    applyTransform(this.container, `translate3d(${x}px,${y}px,0)`);

    // set to '' because the display is set by zoom too. If you would set
    // this value to another like '' you would overrite it
    this.style.display = '';
  }

  hide() {
    if (this.style.display !== 'none') {
      this.style.display = 'none';
    }
  }

  show() {
    this.style.display = '';
  }

  dispose() {
    this.unMount();

    this.container = null;
    this.cssClass = null;
    this.parent = null;
    this.style = null;
  }
}
