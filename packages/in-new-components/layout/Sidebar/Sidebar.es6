import { create } from 'reactive-observables';
import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import { debouncedResize$ } from 'in-services/browser';
import { getCoords } from 'in-services/util/dom';

import locals from './Sidebar.mless';

export default class Sidebar extends React.Component {
  refresh$ = create();

  setWrapper(node) {
    this.wrapper = node;
    this.refresh$.emit(true);
  }

  makeSticky = () => {
    if (!this.wrapper) {
      return;
    }

    this.wrapper.style.bottom = 'auto';
    const coords = getCoords(this.wrapper);
    this.wrapper.style.top = `${coords.top}px`;
    this.wrapper.style.bottom = '0px';
  };

  componentDidMount() {
    this.resizeSubscription = debouncedResize$.subscribe(() => this.refresh$.emit(true));
    this.refreshSubscription = this.refresh$.nextFrame().subscribe(this.makeSticky);
  }

  componentWillUnmount() {
    if (this.resizeSubscription) {
      this.resizeSubscription.dispose();
      this.resizeSubscription = null;
    }
    if (this.refreshSubscription) {
      this.refreshSubscription.dispose();
      this.refreshSubscription = null;
    }
  }

  render() {
    return (
      <div
        ref={r => this.setWrapper(r)}
        {...this.props}
        className={joinClassNames(this.props.className, locals.sidebar)}
      />
    );
  }
}
