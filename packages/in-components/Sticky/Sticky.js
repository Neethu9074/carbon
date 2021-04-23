/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import withSideEffect from 'react-side-effect';
import { create } from '@instana/observables';
import invariant from 'invariant';
import React from 'react';

import { stickyWrapperClassName } from 'in-components/Sticky/scrolling';
import { debouncedResize$ } from 'in-services/browser';
import { getCoords } from 'in-services/util/dom';
import theme from 'in-themes';

export default class extends React.Component {
  static displayName = 'Sticky';

  constructor(props) {
    super(props);

    if (__DEV__) {
      invariant(this.props.header !== undefined, 'A Header must be defined for Sticky component.');
    }
  }

  refresh$ = create();

  setOrder(order) {
    this.order = order;
    this.refresh$.emit(true);
  }

  setHeader(node) {
    this.header = node;
    this.refresh$.emit(true);
  }

  setWrapper(node) {
    this.wrapper = node;
    this.refresh$.emit(true);
  }

  setContentWrapper(node) {
    this.contentWrapper = node;
    this.refresh$.emit(true);
  }

  makeSticky = () => {
    if (!this.wrapper || !this.header) {
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
      if (this.props.children) {
        // Sticky has header and children. On an ideal scenario, chindren must take the remaining height in the screen
        // If a Sticky is being used without chindren, don't set min-height for the child wrapper
        this.contentWrapper.style.minHeight = `${window.innerHeight - this.headerCoords.top - this.headerHeight}px`;
      }
      if (this.props.useFixedLayout) {
        const { contentWidth } = this.props;
        this.contentWrapper.style.position = 'fixed';
        if (contentWidth) this.contentWrapper.style.width = contentWidth;
      }

      if (this.order >= 0) {
        this.header.style.zIndex = theme.zIndex.stickyHeader - this.order;
      }
    } else {
      this.wrapper.style.paddingTop = `0px`;
    }

    if (this.props.backgroundColor) {
      this.wrapper.style.backgroundColor = this.props.backgroundColor;
    }
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
      <section ref={r => this.setWrapper(r)} className={stickyWrapperClassName}>
        <Header setHeader={r => this.setHeader(r)} setOrder={o => this.setOrder(o)}>
          {this.props.header}
        </Header>
        <div ref={r => this.setContentWrapper(r)}>{this.props.children}</div>
      </section>
    );
  }
}

const Header = withSideEffect(
  reduceProps,
  after
)(function Header({ children, setHeader }) {
  return <div ref={r => setHeader(r)}>{children}</div>;
});

function after(propList) {
  for (let i = 0, length = propList.length; i < length; i++) {
    const header = propList[i];
    header.setOrder(i);
  }
}

function reduceProps(propsList) {
  return propsList.reduce((result, props) => result.concat([props]), []);
}
