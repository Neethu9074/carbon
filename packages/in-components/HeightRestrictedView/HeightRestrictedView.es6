import React from 'react';

import { timelineHeight$ } from 'in-components/timeline/timelineStore';
import { debouncedResize$ } from 'in-services/browser';
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
    this.footerHeightSubscription = timelineHeight$.subscribe(this.onFooterHeightChanged);
    this.resizeSubscripotion = debouncedResize$.subscribe(this.onResize);
    this.onResize();
  }

  onFooterHeightChanged = footerHeight => {
    this.footerHeight = footerHeight;
    this.calculateDimensions();
  };

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
    if (window.innerHeight == null || this.footerHeight == null || this.elementCoordinates == null) {
      return;
    }

    const height = window.innerHeight - this.footerHeight - this.elementCoordinates.top;
    this.setState({ height });
  }

  componentWillUnmount() {
    if (this.footerHeightSubscription) {
      this.footerHeightSubscription.dispose();
      this.footerHeightSubscription = null;
    }
  }

  render() {
    const { height } = this.state;
    return (
      <div className={locals.view} ref={this.setElement} style={{ height: `${height}px` }}>
        {height != null && this.props.render(height)}
      </div>
    );
  }
}
