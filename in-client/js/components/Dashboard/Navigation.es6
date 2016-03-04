/* eslint-disable react/no-multi-comp, react/prop-types */
import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import './Navigation.less';

const block = 'in-dashboard-navigation';
const blockItem = block + '__item';
const rpt = React.PropTypes;

const Navigation = React.createClass({
  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshot: irpt.map.isRequired,
    children: rpt.array
  },

  jail: undefined,
  headers: [],

  getInitialState() {
    return { draw: false };
  },

  componentWillUpdate(nextProps) {
    if (this.props.snapshot !== nextProps.snapshot) {
      this.setState({ draw: false });
      this.calculateJail(this.props.snapshot.get('id') !== nextProps.snapshot.get('id'));
    }
  },

  componentDidMount() {
    this.calculateJail();
  },

  calculateJail(scrollToTop) {
    this.clearTimeout();
    this.timeoutHandle = setTimeout(() => {
      this.jail = this.getJail();
      if (this.jail) {
        this.jail.onscroll = this.onScroll;
        if (scrollToTop) {
          this.jail.scrollTop = 0;
        }
        this.setState({ draw: true });
      }
    }, 800);
  },

  componentWillUnmount() {
    this.clearTimeout();
  },

  clearTimeout() {
    if (this.timeoutHandle) {
      window.clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
  },

  render() {
    if (!this.state.draw) {
      return null;
    }

    const jail = this.jail;
    const oldScrollValue = jail.scrollTop;
    this.setScrolling(0);
    const currentHeaders = document.getElementsByClassName('in-dashboard__content-heading') || [];
    this.headers = [];
    for (let i = 0; i < currentHeaders.length; i++) {
      const header = currentHeaders[i];
      this.headers.push({
        element: header,
        label: header.textContent,
        _cachedTop: header.getBoundingClientRect().top
      });
    }
    this.setScrolling(oldScrollValue);

    return (
      <div className={block}>
        {this.headers.map(value => {
          const isVisible = this.state.visibleSection === value.label;
          return (
            <div key={value.label}
                 className={blockItem + ' ' + blockItem + '__' + isVisible}
                 onClick={() => this.jumpToSection(value)}>
              {value.label}
            </div>
          );
        })}
      </div>
    );
  },

  jumpToSection(item) {
    this.jail.scrollTop = item._cachedTop - 140;
  },

  setScrolling(value) {
    this.jail.scrollTop = value;
  },

  onScroll() {
    for (let i = 0; i < this.headers.length; i++) {
      const header = this.headers[i];
      const boundings = header.element.getBoundingClientRect();
      // since the header list is sorted, the first hit is the right to take
      if (boundings.top >= 0) {
        this.setState({ visibleSection: header.label });
        return;
      }
    }
  },

  getJail() {
    const jails = document.getElementsByClassName('in-dashboard__sections');
    if (!jails || jails.length === 0) {
      return null;
    }
    return jails[0];
  }
});

export default Navigation;
