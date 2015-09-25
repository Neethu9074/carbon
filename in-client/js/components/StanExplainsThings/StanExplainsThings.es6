import React from 'react/addons';

import {getClassName} from 'in-services/react';
import Stan from 'in-components/Stan';

import './StanExplainsThings.less';

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
    return (
      <div className={getClassName(this, block)} style={this.props.style}>
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
