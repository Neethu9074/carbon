import React from 'react';

import classnames from 'in-services/util/classnames';

import './SpanTabs.less';

const block = 'in-span-tabs';

export const SpanTabs = React.createClass({
  displayName: 'SpanTabs',

  propTypes: {
    children: React.PropTypes.any
  },

  getInitialState() {
    return {
      selectedTab: 0
    };
  },

  render() {
    const children = this.props.children.filter(child => child && child.props.children);

    if (children.length === 1) {
      return children[0].props.children;
    }

    const selectedTab = children[this.state.selectedTab] || children[0];

    return (
      <div className={block}>
        <ul className={block + '__tab-list'}>
          {children.map((child, i) => (
            <li
              key={i}
              onClick={() => this.setState({ selectedTab: i })}
              className={classnames({
                [block + '__tab']: true,
                [block + '__tab--selected']: i === this.state.selectedTab
              })}
            >
              {child.props.title}
            </li>
          ))}
        </ul>

        {selectedTab.props.children}
      </div>
    );
  }
});

export const SpanTab = function SpanTag() {
  return null;
};
