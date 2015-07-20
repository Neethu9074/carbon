/*eslint-disable react/no-multi-comp*/

'use strict';

import React from 'react';
import classnames from 'instana-ui-services/util/classnames';

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
    collapsible: rpt.bool,
    blockIdentifier: rpt.string,
    children: rpt.array.isRequired,
    style: rpt.object
  },

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

    const blockClassNames = classnames({
      [blockIdentifier]: true,
      [blockIdentifier + '--collapsed']: this.props.collapsible === true &&
        this.state.selectedTab === -1
    });

    return (
      <div className={blockClassNames}
           style={this.props.style}>
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
