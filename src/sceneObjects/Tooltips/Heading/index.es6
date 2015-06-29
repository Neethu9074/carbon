 'use strict';

import React from 'react/addons';

import './index.less';

export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    className: React.PropTypes.string.isRequired,
    style: React.PropTypes.object.isRequired,
    children: React.PropTypes.any.isRequired
  },

  render() {
    let classes = 'in-tooltip__heading';
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

    return (
      <h2 className={classes} style={this.props.style}>
        {this.props.children}
      </h2>
    );
  }
});
