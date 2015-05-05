'use strict';

import React from 'react';

export const Tabs = React.createClass({

  getInitialState() {
    return {
      selectedTab: 0
    };
  },

  render() {
    const headerNodes = this.props.children.map((tab, i) =>
      <li key={tab.props.title}
          onClick={this.selectTab.bind(this, i)}>
        {tab.props.title}
      </li>
    );
    return (
      <div>
        <ul>
          {headerNodes}
        </ul>
        <div>
          {this.props.children[this.state.selectedTab].props.children}
        </div>
      </div>
    );
  },

  selectTab(i) {
    this.setState({
      selectedTab: i
    });
  }
});

export const Tab = React.createClass({
  render() {
    // rendering is handled by the Tabs component
    return null;
  }
});
