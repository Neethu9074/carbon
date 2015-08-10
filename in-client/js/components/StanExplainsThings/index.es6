import React from 'react/addons';

import Stan from 'in-components/Stan';

import './index.less';

const block = 'in-stan-explains';
const rpt = React.PropTypes;

const StanExplainsThings = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    style: rpt.object,
    className: rpt.string,
    header: rpt.string.isRequired,
    children: rpt.any.isRequired
  },

  render() {
    const classes = this.props.className ?
      block + ' ' + this.props.className :
      block;

    return (
      <div className={classes} style={this.props.style}>
        <span className={block + '__header'}>
          {this.props.header}
        </span>
        <span className={block + '__content'}>
          {this.props.children}
        </span>
        <Stan />
      </div>
    );
  }
});

export default StanExplainsThings;
