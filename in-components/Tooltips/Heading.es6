import PureRenderMixin from 'react-addons-pure-render-mixin';
import rpt from 'prop-types';
import React from 'react';

import { getClassName } from 'in-services/react';

import './Heading.less';

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    children: rpt.any.isRequired,
    className: rpt.string,
    style: rpt.object
  },

  render() {
    return (
      <h2 className={getClassName(this, 'in-tooltip__heading')} style={this.props.style}>
        {this.props.children}
      </h2>
    );
  }
});
