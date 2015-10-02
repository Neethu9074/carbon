/*eslint-disable react/no-multi-comp, react/prop-types*/
import React from 'react/addons';

import './Navigation.less';

const block = 'in-dashboard-navigation';
const blockItem = block + '__item';
const rpt = React.PropTypes;

const Navigation = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    children: rpt.array
  },

  jail: undefined,
  headers: [],

  getInitialState() {
    return { draw: false };
  },

  componentDidMount() {
    setTimeout(() => {
      this.jail = this.getJail();
      this.jail.onscroll = this.onScroll;
      this.setState({ draw: true });
    }, 1000);
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
    this.jail.scrollTop = item._cachedTop - 100;
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
