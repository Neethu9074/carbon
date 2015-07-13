 'use strict';

import React from 'react/addons';

import './Heading.less';

export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    className: React.PropTypes.string,
    style: React.PropTypes.object,
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
