'use strict';

import './Icon.less';

import React from 'react';

const Icon = React.createClass({
  render() {
    let classes = 'icon fa fa-' + this.props.type;
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

    if (this.props.onClick) {
      return <button type='button'
                     className={classes}
                     style={this.props.style}
                     onClick={this.props.onClick} />;
    } else {
      return <i className={classes} style={this.props.style} />;
    }
  }
});

export default Icon;
