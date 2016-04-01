/* eslint-disable react/no-multi-comp */
import React from 'react';

import './Tabs.less';

const rpt = React.PropTypes;

export const Tab = React.createClass({

  propTypes: {
    title: rpt.string.isRequired,
    modifier: rpt.string,
    children: rpt.any.isRequired
  },

  render() {
    // rendering is handled by the Tabs component
    return null;
  }
});

export const Tabs = React.createClass({

  propTypes: {
    blockIdentifier: rpt.string,
    children: rpt.any.isRequired,
    style: rpt.object
  },

  getDefaultProps() {
    return {
      // we are writing BEM CSS and have various occurences of tabs in our
      // application that all behave like tabs, but may look differently. This
      // component does provide a default theme, but this theme can easily be
      // changed. Styling can be achieved via the `blockIdentifier` property.
      blockIdentifier: 'in-tabs',
      style: {}
    };
  },

  getInitialState() {
    return {
      selectedTab: 0
    };
  },

  render() {
    const blockIdentifier = this.props.blockIdentifier;
    const headerNodes = React.Children.map(this.props.children, (tab, i) => {
      if (!tab) {
        return null;
      }
      let classNames = blockIdentifier + '__tab';
      if (i === this.state.selectedTab) {
        classNames += ' ' + blockIdentifier + '__tab--active';
      }
      if (tab.props.modifier) {
        classNames += ' ' + blockIdentifier + '__tab--' + tab.props.modifier;
      }
      return (
        <li key={i}
            onClick={this.selectTab.bind(this, i)}
            className={classNames}>
          {tab.props.title}
        </li>
      );
    });

    return (
      <div className={blockIdentifier}
           style={this.props.style}>
        <ul className={blockIdentifier + '__tabs'}>
          {headerNodes}
        </ul>
        {this.state.selectedTab >= 0 ?
          <div className={blockIdentifier + '__tab-content'}>
            {React.Children.toArray(this.props.children)[this.state.selectedTab].props.children}
          </div>
        : null}
      </div>
    );
  },

  selectTab(i) {
    this.setState({
      selectedTab: i
    });
  }
});
