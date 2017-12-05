import React from 'react';

import { debouncedResize$ } from 'in-services/browser';

export default class extends React.Component {
  static displayName = 'Sticky';

  setHeader(node) {
    this.header = node;
    this.makeSticky();
  }

  setWrapper(node) {
    this.wrapper = node;
    this.makeSticky();
  }

  makeSticky = () => {
    if (!this.wrapper) {
      return;
    }

    if (this.header) {
      this.wrapper.style.paddingTop = `0px`;
      this.header.style.position = `static`;
      this.header.style.width = 'auto';
      this.headerCoords = getCoords(this.header);

      this.headerHeight = this.header.clientHeight;
      this.headerWidth = this.header.clientWidth;

      this.header.style.position = `fixed`;
      this.header.style.top = `${this.headerCoords.top}px`;
      this.header.style.left = `${this.headerCoords.left}px`;
      this.header.style.width = `${this.headerWidth}px`;
      this.wrapper.style.paddingTop = `${this.headerHeight}px`;
    } else {
      this.wrapper.style.paddingTop = `0px`;
    }
  };

  componentDidMount() {
    this.resizeSubscription = debouncedResize$.subscribe(this.makeSticky);
  }

  componentWillUnmount() {
    if (this.resizeSubscription) {
      this.resizeSubscription.dispose();
    }
  }

  render() {
    return (
      <div ref={r => this.setWrapper(r)}>
        <div ref={r => this.setHeader(r)}>{this.props.header}</div>

        {this.props.children}
      </div>
    );
  }
}

// Calculate the position of an element relative to the document root;
function getCoords(elem) {
  const box = elem.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
}
