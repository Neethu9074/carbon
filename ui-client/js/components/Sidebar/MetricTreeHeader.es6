'use strict';

import React from 'react/addons';

import './MetricTreeHeader.less';


const block = 'in-sidebar-metric-header';
const rpt = React.PropTypes;
const MetricTreeHeader = React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    content: rpt.string.isRequired,
    onClick: rpt.func.isRequired,
    style: rpt.object,
    className: rpt.string
  },

  render() {
    let classes = this.props.className ?
      block + ' ' + this.props.className :
      block;

    return (
      <div className={classes}
           style={this.props.style}
           onClick={this.props.onClick}>
        {this.props.content}
      </div>
    );
  }
});

export default MetricTreeHeader;
