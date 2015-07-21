'use strict';

import React from 'react/addons';
import MetricTreeLeaf from './MetricTreeLeaf';
import MetricTreeHeader from './MetricTreeHeader';

import './MetricTree.less';


const block = 'in-sidebar-metric-tree';
const rpt = React.PropTypes;
const MetricTree = React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    header: rpt.string.isRequired,
    children: rpt.oneOfType([
      MetricTree,
      MetricTreeLeaf
    ]),
    style: rpt.object,
    className: rpt.string
  },

  getInitialState() {
    return {open: false};
  },

  toggle() {
    this.setState({
      open: !this.state.open
    });
  },

  renderChildren() {
    if(!this.state.open) {
      return null;
    }

    const children = this.props.children.size > 1 ?
      this.props.children :
      [this.props.children];

    return (
      <ul className={block + '__ul'}>
        {children.map((child, i) => {
          return (
            <li key={i} className={block + '__li'}>
              {child}
            </li>
          );
        })}
      </ul>
    );
  },

  render() {
    let classes = this.props.className ?
      block + ' ' + this.props.className :
      block;

    return (
      <div className={classes}
           style={this.props.style}>
        <MetricTreeHeader onClick={this.toggle}
                      content={this.props.header + ' (' + this.props.children.size + ')'}/>
        {this.renderChildren()}
      </div>
    );
  }
});

export default MetricTree;
