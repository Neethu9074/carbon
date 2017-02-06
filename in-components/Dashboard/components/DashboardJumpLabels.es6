/* eslint-disable react/no-did-mount-set-state */

import {on} from 'reactive-observables';
import {isEqual} from 'lodash';
import React from 'react';

import classnames from 'in-services/util/classnames';

import './DashboardJumpLabels.less';

// Ignore this many pixels from the top and bottom of the scroll area to
// avoid listing barely visible sections as visible.
const wiggleRoom = 20;
const slice = Array.prototype.slice;
const block = 'in-dashboard-jump-labels';

export default React.createClass({
  displayName: 'DashboardJumpLabels',

  propTypes: {
    snapshotId: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      top: 0,
      height: 0,
      sections: []
    };
  },

  componentDidMount() {
    this.scrollElement = document.querySelector('.in-dashboard .in-dashboard-content__wrapper');

    this.setState({
      top: this.scrollElement.scrollTop,
      height: this.scrollElement.clientHeight
    });

    this.scrollSubscription = on(this.scrollElement, 'scroll', {passive: true})
      .throttle(200)
      .subscribe(this.onScroll);
    this.resizeSubscription = on(window, 'resize')
      .throttle(200)
      .subscribe(this.onResize);
    this.checkHandle = setTimeout(this.checkForNewElements, 500);
  },

  componentWillUpdate(nextProps) {
    if (this.props.snapshotId !== nextProps.snapshotId) {
      clearTimeout(this.checkHandle);
      this.checkHandle = setTimeout(this.checkForNewElements, 500);
    }
  },

  checkForNewElements() {
    clearTimeout(this.checkHandle);

    const sections = slice.call(document.querySelectorAll('.in-dashboard .in-dashboard-section'))
      .map((section, i) => {
        // unnamed sections may exist
        const heading = section.querySelector('.in-dashboard__content-heading');
        if (!heading) {
          return null;
        }

        return {
          key: String(i),
          label: heading.textContent,
          element: section,
          top: section.offsetTop,
          bottom: section.offsetTop + section.clientHeight
        };
      })
      .filter(section => !!section);

    if (!isEqual(this.state.sections, sections)) {
      this.setState({sections});
      this.checkHandle = setTimeout(this.checkForNewElements, 1000);
    } else {
      this.checkHandle = setTimeout(this.checkForNewElements, 3000);
    }
  },

  onResize() {
    this.setState({
      top: this.scrollElement.scrollTop,
      height: this.scrollElement.clientHeight
    });
    this.checkForNewElements();
  },

  onScroll() {
    this.setState({
      top: this.scrollElement.scrollTop
    });
  },

  componentWillUnmount() {
    clearTimeout(this.checkHandle);
    this.scrollSubscription.dispose();
    this.resizeSubscription.dispose();
  },

  render() {
    if (this.state.sections.length === 0) {
      return null;
    }

    const top = this.state.top + wiggleRoom;
    const bottom = this.state.top + this.state.height - wiggleRoom;
    return (
      <ol className={block}>
        {this.state.sections.map(section => {
          const isInView = (section.top > top && section.top < bottom) ||
            (section.bottom > top && section.bottom < bottom) ||
            (section.top < top && section.bottom > bottom);
          return (
            <li key={section.key}
                className={classnames({
                  [`${block}__item`]: true,
                  [`${block}__item--in-view`]: isInView
                })}
                 // subtract 43 to account for padding and overlays
                onClick={() => this.scrollElement.scrollTop = section.top - 43}>
              {section.label}
            </li>
          );
        })}
      </ol>
    );
  }
});
