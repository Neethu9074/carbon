import withSideEffect from 'react-side-effect';
import { create } from 'reactive-observables';
import invariant from 'invariant';
import React from 'react';

import { reduceProps, after } from 'in-components/Sticky/orderCalculation';
import { debouncedResize$ } from 'in-services/browser';
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

      if (this.order >= 0) {
        this.header.style.zIndex = theme.zIndex.stickyHeader - this.order;
      }
    } else {
      this.wrapper.style.paddingTop = `0px`;
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
      <div ref={r => this.setWrapper(r)}>
        <Header setHeader={r => this.setHeader(r)} setOrder={o => this.setOrder(o)}>
          {this.props.header}
        </Header>

        {this.props.children}
      </div>
    );
  }
}

const Header = withSideEffect(reduceProps, after)(function Header({ children, setHeader }) {
  return <div ref={r => setHeader(r)}>{children}</div>;
});

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
