import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import { debouncedResize$ } from 'in-services/browser';
import { scrollToTop } from 'in-services/util/dom';
import { getCoords } from 'in-services/util/dom';

import locals from './HeightRestrictedView.mless';

export default class HeightRestrictedView extends React.Component {
  static displayName = 'HeightRestrictedView';

  constructor(props) {
    super(props);
    this.state = {
      height: null
    };
  }

  componentDidMount() {
    this.calculateDimensions();
    this.resizeSubscripotion = debouncedResize$.subscribe(this.onResize);
    this.onResize();
  }

  onResize = () => {
    if (this.element) {
      this.elementCoordinates = getCoords(this.element);
    } else {
      this.elementCoordinates = null;
    }
    this.calculateDimensions();
  };

  setElement = ele => {
    this.element = ele;
    this.calculateDimensions();
  };

  calculateDimensions() {
    if (window.innerHeight == null || this.elementCoordinates == null) {
      return;
    }

    const height = window.innerHeight - this.elementCoordinates.top;
    this.setState({ height });
  }

  componentWillUnmount() {
    this.disableScrollIndication();
  }

  componentDidUpdate(prevProps) {
    const { scrollResetProps } = this.props;
    if (!scrollResetProps) {
      return;
    }

    for (let i = 0; i < scrollResetProps.length; i++) {
      if (this.props[scrollResetProps[i]] !== prevProps[scrollResetProps[i]]) {
        return scrollToTop(this.element);
      }
    }
  }

  enableScrollableIndication(scrollableIndicator) {
    this.disableScrollIndication();

    if (scrollableIndicator == null) {
      return;
    }

    this.scrollableIndicator = scrollableIndicator;
    this.scrollContainer = scrollableIndicator.parentNode;
    this.scrollContainer.addEventListener('scroll', this.onScroll, false);
  }

  disableScrollIndication() {
    if (this.scrollContainer) {
      this.scrollContainer.removeEventListener('scroll', this.onScroll, false);
      this.scrollContainer = null;
      this.scrollableIndicator = null;
    }
  }

  onScroll = () => {
    this.scrollableIndicator.style.bottom = `${-1 * this.scrollContainer.scrollTop}px`;
    const maxPxTillInvisiable = 150;
    const indicatorHeight = 100 - 100 * Math.min(1, this.scrollContainer.scrollTop / maxPxTillInvisiable);
    this.scrollableIndicator.style.height = `${indicatorHeight}px`;
  };

  render() {
    const { height } = this.state;
    return (
      <div
        className={joinClassNames(locals.view, this.props.className)}
        ref={this.setElement}
        style={{ height: `${height}px` }}
      >
        {height != null && this.props.render(height)}
        <div className={locals.scrollableIndicator} ref={d => this.enableScrollableIndication(d)} />
      </div>
    );
  }
}
