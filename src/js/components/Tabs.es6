'use strict';

import './Tabs.less';

import React from 'react';

export const Tabs = React.createClass({

  getInitialState() {
    return {
      selectedTab: this.props.collapsible === true ? -1 : 0
    };
  },

  render() {
    // we are writing BEM CSS and have various occurences of tabs in our
    // application that all behave like tabs, but may look differently. This
    // component does provide a default theme, but this theme can easily be
    // changed. Styling can be achieved via the `blockIdentifier` property.
    const blockIdentifier = this.props.blockIdentifier || 'in-subtle-tabs';



    const headerNodes = this.props.children.map((tab, i) => {
      let classNames = blockIdentifier + '__tab';
      if (i === this.state.selectedTab) {
        classNames += ' ' + blockIdentifier + '__tab--active';
      }
      return (
        <li key={tab.props.title}
            onClick={this.selectTab.bind(this, i)}
            className={classNames}>
          {tab.props.title}
        </li>
      );
    });

    return (
      <div className={blockIdentifier}>
        <ul className={blockIdentifier + '__tabs'}>
          {headerNodes}
        </ul>
        {this.state.selectedTab >= 0 ?
          <div className={blockIdentifier + '__tab-content'}>
            {this.props.children[this.state.selectedTab].props.children}
          </div>
        : null}
      </div>
    );
  },

  selectTab(i) {
    if (this.props.collapsible === true && this.state.selectedTab === i) {
      this.setState({
        selectedTab: -1
      });
    } else {
      this.setState({
        selectedTab: i
      });
    }
  }
});

export const Tab = React.createClass({
  render() {
    // rendering is handled by the Tabs component
    return null;
  }
});
