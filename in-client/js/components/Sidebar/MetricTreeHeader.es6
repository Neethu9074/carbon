import React from 'react/addons';

import Icon from 'in-components/Icon';

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
    className: rpt.string,
    iconType: rpt.string.isRequired
  },

  render() {
    const classes = this.props.className ?
      block + ' ' + block + '--' + this.props.className :
      block;

    return (
      <div className={classes}
           style={this.props.style}
           onClick={this.props.onClick}>
        {this.props.content}
        <Icon className={block + '__icon'} type={this.props.iconType} />
      </div>
    );
  }
});

export default MetricTreeHeader;
