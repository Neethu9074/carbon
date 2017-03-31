import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import { getClassName } from 'in-services/react';

import './Heading.less';

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    children: React.PropTypes.any.isRequired,
    className: React.PropTypes.string,
    style: React.PropTypes.object
  },

  render() {
    return (
      <h2 className={getClassName(this, 'in-tooltip__heading')} style={this.props.style}>
        {this.props.children}
      </h2>
    );
  }
});
